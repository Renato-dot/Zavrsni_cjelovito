const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Get all placanja
router.get('/', (req, res) => {
  connection.query("SELECT * FROM placanja", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new placanja
router.post('/', isAuthenticated, (req, res) => {
  connection.query("INSERT INTO placanja SET ?", req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Update placanja
router.put('/:id', isAuthenticated, (req, res) => {
  connection.query("UPDATE placanja SET ? WHERE sifra_placanja = ?", [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

// Delete placanja
router.delete('/:id', isAuthenticated, (req, res) => {
  connection.query("DELETE FROM placanja WHERE sifra_placanja = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Obrisano" });
  });
});

module.exports = router;