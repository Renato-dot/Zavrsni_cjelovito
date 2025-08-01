const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.korisnik) {
    req.user = req.session.korisnik; // Dodaj korisnika u request objekt
    next();
  } else {
    res.status(401).json({ error: "Niste prijavljeni. Pristup odbijen." });
  }
};

module.exports = { isAuthenticated };
