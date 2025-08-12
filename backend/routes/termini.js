const express = require("express");
const router = express.Router();
const connection = require("../config/database");


router.get("/", async (req, res) => {
  const { teren_id, datum } = req.query;
  if (!teren_id || !datum)
    return res.status(400).json({ error: "teren_id i datum su potrebni" });

  try {
    connection.query(
      `SELECT sat, rezerviran FROM termini WHERE teren_id = ? AND datum = ? ORDER BY sat`,
      [teren_id, datum],
      (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Greška na serveru" });
        }

        if (rows.length === 0) {
          const termini = [];
          for (let sat = 8; sat <= 20; sat++) {
            termini.push([teren_id, datum, sat, false]);
          }
          
          connection.query(
            `INSERT INTO termini (teren_id, datum, sat, rezerviran) VALUES ?`,
            [termini],
            (insertErr) => {
              if (insertErr) {
                console.error(insertErr);
                return res.status(500).json({ error: "Greška pri kreiranju termina" });
              }
              
              connection.query(
                `SELECT sat, rezerviran FROM termini WHERE teren_id = ? AND datum = ? ORDER BY sat`,
                [teren_id, datum],
                (selectErr, newRows) => {
                  if (selectErr) {
                    console.error(selectErr);
                    return res.status(500).json({ error: "Greška na serveru" });
                  }
                  res.json(newRows);
                }
              );
            }
          );
        } else {
          res.json(rows);
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Greška na serveru" });
  }
});


router.post("/rezerviraj", (req, res) => {
  const { teren_id, datum, sat, korisnik_id } = req.body;
  if (!teren_id || !datum || sat === undefined || !korisnik_id) {
    return res.status(400).json({ error: "nedostaju parametri" });
  }

  connection.query(
    `SELECT rezerviran FROM termini WHERE teren_id = ? AND datum = ? AND sat = ?`,
    [teren_id, datum, sat],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Greška na serveru" });
      }

      if (rows.length === 0) {
        return res.status(400).json({ error: "Termin ne postoji" });
      }
      if (rows[0].rezerviran) {
        return res.status(409).json({ error: "Termin je zauzet" });
      }

      connection.query(
        `UPDATE termini SET rezerviran = TRUE, sifra_korisnika = ? WHERE teren_id = ? AND datum = ? AND sat = ?`,
        [korisnik_id, teren_id, datum, sat],
        (updateErr) => {
          if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ error: "Greška na serveru" });
          }
          res.json({ message: "Termin uspješno rezerviran" });
        }
      );
    }
  );
});

module.exports = router;
