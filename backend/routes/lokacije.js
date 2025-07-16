const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Get all lokacije
router.get('/', (req, res) => {
  connection.query("SELECT * FROM lokacije", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new lokacije
router.post('/', isAuthenticated, (req, res) => {
  connection.query("INSERT INTO lokacije SET ?", req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Update lokacije
router.put('/:id', isAuthenticated, (req, res) => {
  connection.query("UPDATE lokacije SET ? WHERE sifra_lokacije = ?", [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

// Delete lokacije
router.delete('/:id', isAuthenticated, (req, res) => {
  connection.query("DELETE FROM lokacije WHERE sifra_lokacije = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Obrisano" });
  });
});

module.exports = router;