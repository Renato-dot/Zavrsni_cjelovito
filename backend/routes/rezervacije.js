const express = require("express");
const router = express.Router();
const connection = require("../config/database");
const { isAuthenticated } = require("../middleware/auth");

// Dohvati sve rezervacije
router.get("/", (req, res) => {
  connection.query("SELECT * FROM Rezervacije", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Dodaj novu rezervaciju
router.post("/", isAuthenticated, (req, res) => {
  console.log("SESSION KORISNIK:", req.session.korisnik);
  console.log("BODY:", req.body);

  const korisnik = req.session.korisnik;

  if (!korisnik) {
    return res.status(401).json({ error: "Niste prijavljeni" });
  }

  const { Naziv, datum_iznajmljivanja } = req.body;

  if (!Naziv || !datum_iznajmljivanja) {
    return res.status(400).json({ error: "Nedostaju potrebni podaci" });
  }

  const sql = `
    INSERT INTO Rezervacije (ime_korisnika, prezime_korisnika, Naziv, datum_iznajmljivanja)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [
      korisnik.ime_korisnika,
      korisnik.prezime_korisnika,
      Naziv,
      datum_iznajmljivanja,
    ],
    (err, result) => {
      if (err) {
        console.error("SQL ERROR:", err);
        return res
          .status(500)
          .json({ error: "Greška pri spremanju rezervacije" });
      }
      console.log("Rezervacija uspješna:", result);
      res.json({ message: "Rezervacija uspješna!" });
    }
  );
});

// Ažuriraj rezervaciju
router.put("/:id", isAuthenticated, (req, res) => {
  connection.query(
    "UPDATE Rezervacije SET ? WHERE sifra_narudzbe = ?",
    [req.body, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// Obriši rezervaciju
router.delete("/:id", isAuthenticated, (req, res) => {
  connection.query(
    "DELETE FROM Rezervacije WHERE sifra_narudzbe = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Obrisano" });
    }
  );
});

module.exports = router;
