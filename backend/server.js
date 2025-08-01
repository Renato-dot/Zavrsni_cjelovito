const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "moja-super-tajna", // koristi .env varijablu u pravilu
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // ako je HTTPS, stavi true
      maxAge: 1000 * 60 * 60 * 24, // 1 dan
    },
  })
);

// Import routes
const artikliRoutes = require('./routes/artikli');
const korisnikRoutes = require('./routes/korisnik');
const lokacijeRoutes = require('./routes/lokacije');
const narudzbeRoutes = require('./routes/narudzbe');
const placanjaRoutes = require('./routes/placanja');
const rezervacijeRoutes = require('./routes/rezervacije');
const stavkeRoutes = require('./routes/stavke');
const tereniRoutes = require('./routes/tereni');
const adminRoutes = require("./routes/admin");

// Use routes
app.use('/api/artikli', artikliRoutes);
app.use('/api/korisnik', korisnikRoutes);
app.use('/api/lokacije', lokacijeRoutes);
app.use('/api/narudzbe', narudzbeRoutes);
app.use('/api/placanja', placanjaRoutes);
app.use('/api/rezervacije', rezervacijeRoutes);
app.use('/api/stavke', stavkeRoutes);
app.use('/api/tereni', tereniRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;