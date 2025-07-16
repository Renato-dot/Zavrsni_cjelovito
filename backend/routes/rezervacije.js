const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Get all rezervacije
router.get('/', (req, res) => {
  connection.query("SELECT * FROM Rezervacije", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new rezervacije
router.post('/', isAuthenticated, (req, res) => {
  connection.query("INSERT INTO Rezervacije SET ?", req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Update rezervacije
router.put('/:id', isAuthenticated, (req, res) => {
  connection.query("UPDATE Rezervacije SET ? WHERE sifra_narudzbe = ?", [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

// Delete rezervacije
router.delete('/:id', isAuthenticated, (req, res) => {
  connection.query("DELETE FROM Rezervacije WHERE sifra_narudzbe = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Obrisano" });
  });
});

module.exports = router;