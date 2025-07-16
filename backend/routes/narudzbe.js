const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Get all narudzbe
router.get('/', (req, res) => {
  connection.query("SELECT * FROM narudzbe", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new narudzbe
router.post('/', isAuthenticated, (req, res) => {
  connection.query("INSERT INTO narudzbe SET ?", req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Update narudzbe
router.put('/:id', isAuthenticated, (req, res) => {
  connection.query("UPDATE narudzbe SET ? WHERE sifra_narudzbe = ?", [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

// Delete narudzbe
router.delete('/:id', isAuthenticated, (req, res) => {
  connection.query("DELETE FROM narudzbe WHERE sifra_narudzbe = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Obrisano" });
  });
});

module.exports = router;