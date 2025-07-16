const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Get all tereni
router.get('/', (req, res) => {
  connection.query("SELECT * FROM Tereni", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new tereni
router.post('/', isAuthenticated, (req, res) => {
  connection.query("INSERT INTO Tereni SET ?", req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Update tereni
router.put('/:id', isAuthenticated, (req, res) => {
  connection.query("UPDATE Tereni SET ? WHERE Sifra_terena = ?", [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

// Delete tereni
router.delete('/:id', isAuthenticated, (req, res) => {
  connection.query("DELETE FROM Tereni WHERE Sifra_terena = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Obrisano" });
  });
});

module.exports = router;