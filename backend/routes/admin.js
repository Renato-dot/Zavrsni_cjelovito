const express = require("express");
const router = express.Router();
const db = require("./db"); // pretpostavka: koristiš konekciju kao `db.query(...)`

// GET all admins
router.get("/", (req, res) => {
  db.query("SELECT * FROM Admin", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET one admin by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM Admin WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "Admin not found" });
    res.json(results[0]);
  });
});

// CREATE new admin
router.post("/", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "INSERT INTO Admin (username, password) VALUES (?, ?)",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, username, password });
    }
  );
});

// UPDATE admin
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  db.query(
    "UPDATE Admin SET username = ?, password = ? WHERE id = ?",
    [username, password, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Admin not found" });
      res.json({ id, username, password });
    }
  );
});

// DELETE admin
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM Admin WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Admin deleted successfully" });
  });
});

module.exports = router;
