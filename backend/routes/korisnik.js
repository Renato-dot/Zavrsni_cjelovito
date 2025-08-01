const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const bcrypt = require("bcrypt");


router.get('/', (req, res) => {
  connection.query("SELECT * FROM korisnik", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.get('/:id', (req, res) => {
  connection.query("SELECT * FROM korisnik WHERE sifra_korisnika = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});


router.post('/', (req, res) => {
  connection.query("INSERT INTO korisnik SET ?", req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});


router.put('/:id', isAuthenticated, (req, res) => {
  connection.query("UPDATE korisnik SET ? WHERE sifra_korisnika = ?", [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});


router.delete('/:id', isAuthenticated, (req, res) => {
  connection.query("DELETE FROM korisnik WHERE sifra_korisnika = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Obrisano" });
  });
});


router.post("/login", (req, res) => {
  const { email_korisnika, lozinka } = req.body;

  const sql = "SELECT * FROM korisnik WHERE email_korisnika = ?";
  connection.query(sql, [email_korisnika], (err, results) => {
    if (err) return res.status(500).json({ error: "Greška na serveru" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Pogrešan email ili lozinka" });
    }

    const korisnik = results[0];

    // Provjeri hashiranu lozinku
    bcrypt.compare(lozinka, korisnik.lozinka, (bcryptErr, isMatch) => {
      if (bcryptErr) {
        return res
          .status(500)
          .json({ error: "Greška prilikom provjere lozinke" });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Pogrešan email ili lozinka" });
      }

      // Uspješna prijava – spremi sesiju
      req.session.korisnik = korisnik;
      req.session.korisnikId = korisnik.sifra_korisnika; // <-- Ovo je bitno za rezervacije

      res.json({ message: "Prijava uspješna", korisnik });
    });
  });
});


router.post("/register", (req, res) => {
  const {
    ime_korisnika,
    prezime_korisnika,
    broj_telefona_korisnika,
    email_korisnika,
    korisnicko_ime,
    lozinka,
  } = req.body;

  if (
    !ime_korisnika ||
    !prezime_korisnika ||
    !broj_telefona_korisnika ||
    !email_korisnika ||
    !korisnicko_ime ||
    !lozinka
  ) {
    return res.status(400).json({ error: "Nedostaju podaci" });
  }

  
  connection.query(
    "SELECT * FROM korisnik WHERE email_korisnika = ? OR korisnicko_ime = ?",
    [email_korisnika, korisnicko_ime],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Greška na serveru" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Korisnik već postoji" });
      }

      
      bcrypt.hash(lozinka, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error(hashErr);
          return res
            .status(500)
            .json({ error: "Greška prilikom hashiranja lozinke" });
        }

        
        connection.query(
          `INSERT INTO korisnik 
           (ime_korisnika, prezime_korisnika, broj_telefona_korisnika, email_korisnika, korisnicko_ime, lozinka) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            ime_korisnika,
            prezime_korisnika,
            broj_telefona_korisnika,
            email_korisnika,
            korisnicko_ime,
            hashedPassword,
          ],
          (insertErr, insertResults) => {
            if (insertErr) {
              console.error(insertErr);
              return res.status(500).json({ error: "Greška na serveru" });
            }

            return res.json({ message: "Registracija uspješna" });
          }
        );
      });
    }
  );
});


module.exports = router;