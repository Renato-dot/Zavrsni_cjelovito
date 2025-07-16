const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Get all stavke
router.get('/', (req, res) => {
  connection.query("SELECT * FROM stavke_narudzbe", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new stavke
router.post('/', isAuthenticated, (req, res) => {
  connection.query("INSERT INTO stavke_narudzbe SET ?", req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Update stavke
router.put('/:id', isAuthenticated, (req, res) => {
  connection.query("UPDATE stavke_narudzbe SET ? WHERE sifra_artikla_narudzbe = ?", [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

// Delete stavke
router.delete('/:id', isAuthenticated, (req, res) => {
  connection.query("DELETE FROM stavke_narudzbe WHERE sifra_artikla_narudzbe = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Obrisano" });
  });
});

module.exports = router;