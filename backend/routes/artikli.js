const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Get all artikli
router.get('/', (req, res) => {
  connection.query("SELECT * FROM artikli", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get artikli by ID
router.get('/:id', (req, res) => {
  connection.query("SELECT * FROM artikli WHERE sifra_artikla = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// Create new artikli
router.post('/', isAuthenticated, (req, res) => {
  connection.query("INSERT INTO artikli SET ?", req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Update artikli
router.put('/:id', isAuthenticated, (req, res) => {
  connection.query("UPDATE artikli SET ? WHERE sifra_artikla = ?", [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

// Delete artikli
router.delete('/:id', isAuthenticated, (req, res) => {
  connection.query("DELETE FROM artikli WHERE sifra_artikla = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Obrisano" });
  });
});

module.exports = router;