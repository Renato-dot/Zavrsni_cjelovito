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
  const korisnik = req.session.korisnik;
  console.log("SESSION KORISNIK:", korisnik);
  console.log("BODY:", req.body);

  if (!korisnik) {
    return res.status(401).json({ error: "Niste prijavljeni" });
  }

  const { Naziv, datum_iznajmljivanja } = req.body;

  if (!Naziv || !datum_iznajmljivanja) {
    return res.status(400).json({ error: "Nedostaju potrebni podaci" });
  }

  // Prvo ubaci narudzbu s datumom iznajmljivanja
  const insertNarudzbaSql = `
    INSERT INTO narudzbe (datum_iznajmljivanja, sifra_korisnika, datum_vracanja, ukupan_iznos) 
    VALUES (?, ?, null, null)
  `;

  connection.query(
    insertNarudzbaSql,
    [datum_iznajmljivanja, korisnik.sifra_korisnika],
    (err, result) => {
      if (err) {
        console.error("Greška kod umetanja narudžbe:", err);
        return res.status(500).json({ error: "Greška pri spremanju narudžbe" });
      }

      const sifra_narudzbe = result.insertId;

      // Sad ubaci rezervaciju sa sifrom narudzbe kao FK
      const insertRezervacijaSql = `
        INSERT INTO Rezervacije (ime_korisnika, prezime_korisnika, Naziv, datum_iznajmljivanja, sifra_narudzbe)
        VALUES (?, ?, ?, ?, ?)
      `;

      connection.query(
        insertRezervacijaSql,
        [
          korisnik.ime_korisnika,
          korisnik.prezime_korisnika,
          Naziv,
          datum_iznajmljivanja,
          sifra_narudzbe,
        ],
        (err2, result2) => {
          if (err2) {
            console.error("Greška kod spremanja rezervacije:", err2);
            return res
              .status(500)
              .json({ error: "Greška pri spremanju rezervacije" });
          }

          console.log("Rezervacija uspješna:", result2);
          res.json({ message: "Rezervacija uspješna!" });
        }
      );
    }
  );
});


module.exports = router;

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
