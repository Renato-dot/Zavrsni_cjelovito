const express = require("express");
const router = express.Router();
const connection = require("../config/database");
const { isAuthenticated } = require("../middleware/auth");

// Get all admin entries
router.get("/", (req, res) => {
  connection.query("SELECT * FROM Admin", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get admin by ID
router.get("/:id", (req, res) => {
  connection.query(
    "SELECT * FROM Admin WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Admin not found" });
      res.json(results[0]);
    }
  );
});

// Create new admin
router.post("/", isAuthenticated, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Username and password are required" });

  connection.query(
    "INSERT INTO Admin (username, password) VALUES (?, ?)",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, username, password });
    }
  );
});

// Update admin
router.put("/:id", isAuthenticated, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Username and password are required" });

  connection.query(
    "UPDATE Admin SET username = ?, password = ? WHERE id = ?",
    [username, password, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, username, password });
    }
  );
});

// Delete admin
router.delete("/:id", isAuthenticated, (req, res) => {
  connection.query("DELETE FROM Admin WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Obrisano" });
  });
});


// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Korisničko ime i lozinka su obavezni' });
  }

  const sql = 'SELECT * FROM Admin WHERE username = ? AND password = ?';
  connection.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Greška na serveru' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Pogrešno korisničko ime ili lozinka' });
    }

    req.session.admin = results[0]; // Sprema admina u sesiju
    res.json({ message: 'Prijava uspješna', user: results[0] });
  });
});

module.exports = router;
