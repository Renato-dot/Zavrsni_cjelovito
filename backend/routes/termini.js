const express = require("express");
const router = express.Router();
const connection = require("../config/database");


router.get("/", async (req, res) => {
  const { teren_id, datum } = req.query;
  if (!teren_id || !datum)
    return res.status(400).json({ error: "teren_id i datum su potrebni" });

  try {
    const [rows] = await db.query(
      `SELECT sat, rezerviran FROM termini WHERE teren_id = ? AND datum = ? ORDER BY sat`,
      [teren_id, datum]
    );


    if (rows.length === 0) {
      const termini = [];
      for (let sat = 8; sat <= 20; sat++) {
        termini.push([teren_id, datum, sat, false]);
      }
      await db.query(
        `INSERT INTO termini (teren_id, datum, sat, rezerviran) VALUES ?`,
        [termini]
      );

      const [newRows] = await db.query(
        `SELECT sat, rezerviran FROM termini WHERE teren_id = ? AND datum = ? ORDER BY sat`,
        [teren_id, datum]
      );
      return res.json(newRows);
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Greška na serveru" });
  }
});


router.post("/rezerviraj", async (req, res) => {
  const { teren_id, datum, sat, korisnik_id } = req.body;
  if (!teren_id || !datum || sat === undefined || !korisnik_id) {
    return res.status(400).json({ error: "nedostaju parametri" });
  }

  try {

    const [rows] = await db.query(
      `SELECT rezerviran FROM termini WHERE teren_id = ? AND datum = ? AND sat = ?`,
      [teren_id, datum, sat]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Termin ne postoji" });
    }
    if (rows[0].rezerviran) {
      return res.status(409).json({ error: "Termin je zauzet" });
    }

    
    await db.query(
      `UPDATE termini SET rezerviran = TRUE, korisnik_id = ? WHERE teren_id = ? AND datum = ? AND sat = ?`,
      [korisnik_id, teren_id, datum, sat]
    );

    res.json({ message: "Termin uspješno rezerviran" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Greška na serveru" });
  }
});

module.exports = router;
