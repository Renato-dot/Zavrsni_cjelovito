const isAuthenticated = (req, res, next) => {
  if (req.session && (req.session.korisnik || req.session.admin)) {
    req.user = req.session.korisnik || req.session.admin; // Dodaj korisnika/admina u request objekt
    next();
  } else {
    res.status(401).json({ error: "Niste prijavljeni. Pristup odbijen." });
  }
};

module.exports = { isAuthenticated };
