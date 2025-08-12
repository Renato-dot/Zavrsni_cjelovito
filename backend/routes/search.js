const express = require("express");
const router = express.Router();
const connection = require("../config/database");

router.get("/", async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query param q is required" });
  }

  try {
    const [rows] = await db.execute(
      `SELECT 
         Sifra_terena AS id,
         Naziv AS name,
         Lokacija AS description,
         'field' AS type,
         cijena AS price
       FROM tereni
       WHERE 
         Naziv LIKE ? OR
         Lokacija LIKE ? OR
         Radno_vrijeme LIKE ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    // Dodaj hardkodirane vanjske linkove
    const links = [
      {
        id: "link-1",
        name: "SportCenter Pro",
        description: "Professional sports facility management",
        type: "external",
        url: "https://www.sportcenter.com",
      },
      {
        id: "link-2",
        name: "Athletic Fields Network",
        description: "Connect with sports fields nationwide",
        type: "external",
        url: "https://www.athleticfields.net",
      },
      {
        id: "link-3",
        name: "SwimClub Central",
        description: "Premier swimming facilities directory",
        type: "external",
        url: "https://www.swimclub.com",
      },
      {
        id: "link-4",
        name: "Basketball Courts USA",
        description: "Find basketball courts across America",
        type: "external",
        url: "https://www.basketballcourts.usa",
      },
      {
        id: "link-5",
        name: "Tennis World",
        description: "Global tennis court booking platform",
        type: "external",
        url: "https://www.tennisworld.com",
      },
      {
        id: "link-6",
        name: "Volleyball Arena",
        description: "Beach and indoor volleyball facilities",
        type: "external",
        url: "https://www.volleyballarena.com",
      },
    ];

    const filteredLinks = links.filter(
      (link) =>
        link.name.toLowerCase().includes(query.toLowerCase()) ||
        link.description.toLowerCase().includes(query.toLowerCase())
    );

    res.json([...rows, ...filteredLinks]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
