const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Get all korisnik
router.get('/', (req, res) => {
  connection.query("SELECT * FROM korisnik", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get korisnik by ID
router.get('/:id', (req, res) => {
  connection.query("SELECT * FROM korisnik WHERE sifra_korisnika = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// Create new korisnik
router.post('/', (req, res) => {
  connection.query("INSERT INTO korisnik SET ?", req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Update korisnik
router.put('/:id', isAuthenticated, (req, res) => {
  connection.query("UPDATE korisnik SET ? WHERE sifra_korisnika = ?", [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

// Delete korisnik
router.delete('/:id', isAuthenticated, (req, res) => {
  connection.query("DELETE FROM korisnik WHERE sifra_korisnika = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Obrisano" });
  });
});

// POST /api/korisnik/login
router.post("/login", (req, res) => {
  const { email_korisnika, lozinka } = req.body;

  const sql =
    "SELECT * FROM korisnik WHERE email_korisnika = ? AND lozinka = ?";
  connection.query(sql, [email_korisnika, lozinka], (err, results) => {
    if (err) return res.status(500).json({ error: "Greška na serveru" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Pogrešan email ili lozinka" });
    }

    req.session.korisnik = results[0]; // Sprema korisnika u sesiju
    res.json({ message: "Prijava uspješna", korisnik: results[0] });
  });
});
module.exports = router;