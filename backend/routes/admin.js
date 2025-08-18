const express = require("express");
const router = express.Router();
const connection = require("../config/database");

// Middleware za provjeru admin sesije
function authAdmin(req, res, next) {
  if (req.session?.admin || req.session?.korisnik?.username) return next();
  res.status(401).json({ error: "Niste prijavljeni. Pristup odbijen." });
}

router.post("/", (req, res) => {
  const { username, password } = req.body;
  const sql = "INSERT INTO Admin (username, password) VALUES (?, ?)";
  connection.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Greška na serveru" });
    res.json({ message: "Admin dodan", id: results.insertId });
  });
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Korisničko ime i lozinka su obavezni" });

  const sql = "SELECT * FROM Admin WHERE username = ? AND password = ?";
  connection.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Greška na serveru" });
    if (results.length === 0)
      return res
        .status(401)
        .json({ error: "Pogrešno korisničko ime ili lozinka" });

    const admin = results[0];
    req.session.admin = admin;
    req.session.korisnik = { ...admin, isAdmin: true }; // Dodaj i u korisnik za kompatibilnost
    res.json({ message: "Prijava uspješna", admin: admin, korisnik: admin });
  });
});

// Logout
router.post("/logout", authAdmin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Greška pri odjavi" });
    }
    res.json({ message: "Odjava uspješna" });
  });
});

// Dohvat svih admina
router.get("/", authAdmin, (req, res) => {
  const sql = "SELECT * FROM Admin";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Greška na serveru" });
    res.json(results);
  });
});

// Update admina
router.put("/:id", authAdmin, (req, res) => {
  const { username, password } = req.body;
  const sql = "UPDATE Admin SET username = ?, password = ? WHERE id = ?";
  connection.query(sql, [username, password, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Greška na serveru" });
    res.json({ message: "Admin ažuriran" });
  });
});

module.exports = router;
