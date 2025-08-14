const express = require("express");
const router = express.Router();
const connection = require("../config/database");
const { isAuthenticated } = require("../middleware/auth");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM korisnik", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  connection.query(
    "SELECT * FROM korisnik WHERE sifra_korisnika = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0]);
    }
  );
});

router.post("/", (req, res) => {
  const {
    ime_korisnika,
    prezime_korisnika,
    broj_telefona_korisnika,
    email_korisnika,
    korisnicko_ime,
    lozinka,
  } = req.body;

<<<<<<< HEAD
=======
router.post('/', (req, res) => {
  const {
    ime_korisnika,
    prezime_korisnika,
    broj_telefona_korisnika,
    email_korisnika,
    korisnicko_ime,
    lozinka,
  } = req.body;

>>>>>>> refs/remotes/origin/main
  if (
    !ime_korisnika ||
    !prezime_korisnika ||
    !email_korisnika ||
    !korisnicko_ime ||
    !lozinka
  ) {
    return res.status(400).json({ error: "Nedostaju obavezni podaci" });
  }

  // Provjeri postoji li korisnik s istim emailom ili korisničkim imenom
  connection.query(
    "SELECT * FROM korisnik WHERE email_korisnika = ? OR korisnicko_ime = ?",
    [email_korisnika, korisnicko_ime],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Greška na serveru" });
      }

      if (results.length > 0) {
<<<<<<< HEAD
        return res
          .status(400)
          .json({
            error: "Korisnik s tim emailom ili korisničkim imenom već postoji",
          });
=======
        return res.status(400).json({ error: "Korisnik s tim emailom ili korisničkim imenom već postoji" });
>>>>>>> refs/remotes/origin/main
      }

      // Hashiraj lozinku
      bcrypt.hash(lozinka, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error(hashErr);
          return res
            .status(500)
            .json({ error: "Greška prilikom hashiranja lozinke" });
        }

        // Stvori korisnika
        connection.query(
          `INSERT INTO korisnik 
           (ime_korisnika, prezime_korisnika, broj_telefona_korisnika, email_korisnika, korisnicko_ime, lozinka) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            ime_korisnika,
            prezime_korisnika,
            broj_telefona_korisnika || null,
            email_korisnika,
            korisnicko_ime,
            hashedPassword,
          ],
          (insertErr, insertResults) => {
            if (insertErr) {
              console.error(insertErr);
              return res.status(500).json({ error: "Greška na serveru" });
            }

<<<<<<< HEAD
            res.status(201).json({
              id: insertResults.insertId,
=======
            res.status(201).json({ 
              id: insertResults.insertId, 
>>>>>>> refs/remotes/origin/main
              message: "Korisnik uspješno stvoren",
              korisnik: {
                sifra_korisnika: insertResults.insertId,
                ime_korisnika,
                prezime_korisnika,
                email_korisnika,
<<<<<<< HEAD
                korisnicko_ime,
              },
=======
                korisnicko_ime
              }
>>>>>>> refs/remotes/origin/main
            });
          }
        );
      });
    }
  );
});

router.put("/:id", isAuthenticated, (req, res) => {
  const {
    ime_korisnika,
    prezime_korisnika,
    broj_telefona_korisnika,
    email_korisnika,
    korisnicko_ime,
    lozinka,
  } = req.body;

<<<<<<< HEAD
=======
router.put('/:id', isAuthenticated, (req, res) => {
  const {
    ime_korisnika,
    prezime_korisnika,
    broj_telefona_korisnika,
    email_korisnika,
    korisnicko_ime,
    lozinka,
  } = req.body;

>>>>>>> refs/remotes/origin/main
  if (
    !ime_korisnika ||
    !prezime_korisnika ||
    !email_korisnika ||
    !korisnicko_ime
  ) {
    return res.status(400).json({ error: "Nedostaju obavezni podaci" });
  }

  // Ako je lozinka unesena, hashiraj je
  if (lozinka) {
    bcrypt.hash(lozinka, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error(hashErr);
<<<<<<< HEAD
        return res
          .status(500)
          .json({ error: "Greška prilikom hashiranja lozinke" });
=======
        return res.status(500).json({ error: "Greška prilikom hashiranja lozinke" });
>>>>>>> refs/remotes/origin/main
      }

      const updateData = {
        ime_korisnika,
        prezime_korisnika,
        broj_telefona_korisnika: broj_telefona_korisnika || null,
        email_korisnika,
        korisnicko_ime,
<<<<<<< HEAD
        lozinka: hashedPassword,
      };

      connection.query(
        "UPDATE korisnik SET ? WHERE sifra_korisnika = ?",
        [updateData, req.params.id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ id: req.params.id, message: "Korisnik ažuriran" });
        }
      );
=======
        lozinka: hashedPassword
      };

      connection.query("UPDATE korisnik SET ? WHERE sifra_korisnika = ?", [updateData, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, message: "Korisnik ažuriran" });
      });
>>>>>>> refs/remotes/origin/main
    });
  } else {
    // Ažuriraj bez lozinke
    const updateData = {
      ime_korisnika,
      prezime_korisnika,
      broj_telefona_korisnika: broj_telefona_korisnika || null,
      email_korisnika,
<<<<<<< HEAD
      korisnicko_ime,
    };

    connection.query(
      "UPDATE korisnik SET ? WHERE sifra_korisnika = ?",
      [updateData, req.params.id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, message: "Korisnik ažuriran" });
      }
    );
=======
      korisnicko_ime
    };

    connection.query("UPDATE korisnik SET ? WHERE sifra_korisnika = ?", [updateData, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, message: "Korisnik ažuriran" });
    });
>>>>>>> refs/remotes/origin/main
  }
});

router.delete("/:id", isAuthenticated, (req, res) => {
  connection.query(
    "DELETE FROM korisnik WHERE sifra_korisnika = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Obrisano" });
    }
  );
});

router.post("/login", (req, res) => {
  const { email_korisnika, lozinka } = req.body;

  const sql = "SELECT * FROM korisnik WHERE email_korisnika = ?";
  connection.query(sql, [email_korisnika], (err, results) => {
    if (err) return res.status(500).json({ error: "Greška na serveru" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Pogrešan email ili lozinka" });
    }

    const korisnik = results[0];

    // Provjeri hashiranu lozinku
    bcrypt.compare(lozinka, korisnik.lozinka, (bcryptErr, isMatch) => {
      if (bcryptErr) {
        return res
          .status(500)
          .json({ error: "Greška prilikom provjere lozinke" });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Pogrešan email ili lozinka" });
      }

      // Uspješna prijava – spremi sesiju
      req.session.korisnik = korisnik;
      req.session.korisnikId = korisnik.sifra_korisnika; // <-- Ovo je bitno za rezervacije

      res.json({ message: "Prijava uspješna", korisnik });
    });
  });
});

router.post("/register", (req, res) => {
  const {
    ime_korisnika,
    prezime_korisnika,
    broj_telefona_korisnika,
    email_korisnika,
    korisnicko_ime,
    lozinka,
  } = req.body;

  if (
    !ime_korisnika ||
    !prezime_korisnika ||
    !broj_telefona_korisnika ||
    !email_korisnika ||
    !korisnicko_ime ||
    !lozinka
  ) {
    return res.status(400).json({ error: "Nedostaju podaci" });
  }

  connection.query(
    "SELECT * FROM korisnik WHERE email_korisnika = ? OR korisnicko_ime = ?",
    [email_korisnika, korisnicko_ime],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Greška na serveru" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Korisnik već postoji" });
      }

      bcrypt.hash(lozinka, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error(hashErr);
          return res
            .status(500)
            .json({ error: "Greška prilikom hashiranja lozinke" });
        }

        connection.query(
          `INSERT INTO korisnik 
           (ime_korisnika, prezime_korisnika, broj_telefona_korisnika, email_korisnika, korisnicko_ime, lozinka) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            ime_korisnika,
            prezime_korisnika,
            broj_telefona_korisnika,
            email_korisnika,
            korisnicko_ime,
            hashedPassword,
          ],
          (insertErr, insertResults) => {
            if (insertErr) {
              console.error(insertErr);
              return res.status(500).json({ error: "Greška na serveru" });
            }

            return res.json({ message: "Registracija uspješna" });
          }
        );
      });
    }
  );
});

module.exports = router;
