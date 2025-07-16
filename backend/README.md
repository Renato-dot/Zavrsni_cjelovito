# SportFields Backend API

A Node.js/Express backend API for the SportFields Rental application with MySQL database integration.

## Features

- Complete CRUD operations for all entities
- JWT authentication middleware
- Rate limiting for security
- CORS configuration
- Environment-based configuration
- Modular route structure

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure your settings:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sportfields_db
DB_PORT=3306

PORT=3000
NODE_ENV=development

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup
Make sure you have MySQL running and create the database:
```sql
CREATE DATABASE sportfields_db;
```

Create the required tables based on your existing schema.

### 4. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Artikli
- `GET /api/artikli` - Get all artikli
- `GET /api/artikli/:id` - Get artikli by ID
- `POST /api/artikli` - Create new artikli (requires auth)
- `PUT /api/artikli/:id` - Update artikli (requires auth)
- `DELETE /api/artikli/:id` - Delete artikli (requires auth)

### Korisnik
- `GET /api/korisnik` - Get all korisnik
- `GET /api/korisnik/:id` - Get korisnik by ID
- `POST /api/korisnik` - Create new korisnik
- `PUT /api/korisnik/:id` - Update korisnik (requires auth)
- `DELETE /api/korisnik/:id` - Delete korisnik (requires auth)

### Lokacije
- `GET /api/lokacije` - Get all lokacije
- `POST /api/lokacije` - Create new lokacije (requires auth)
- `PUT /api/lokacije/:id` - Update lokacije (requires auth)
- `DELETE /api/lokacije/:id` - Delete lokacije (requires auth)

### Narudzbe
- `GET /api/narudzbe` - Get all narudzbe
- `POST /api/narudzbe` - Create new narudzbe (requires auth)
- `PUT /api/narudzbe/:id` - Update narudzbe (requires auth)
- `DELETE /api/narudzbe/:id` - Delete narudzbe (requires auth)

### Placanja
- `GET /api/placanja` - Get all placanja
- `POST /api/placanja` - Create new placanja (requires auth)
- `PUT /api/placanja/:id` - Update placanja (requires auth)
- `DELETE /api/placanja/:id` - Delete placanja (requires auth)

### Rezervacije
- `GET /api/rezervacije` - Get all rezervacije
- `POST /api/rezervacije` - Create new rezervacije (requires auth)
- `PUT /api/rezervacije/:id` - Update rezervacije (requires auth)
- `DELETE /api/rezervacije/:id` - Delete rezervacije (requires auth)

### Stavke Narudzbe
- `GET /api/stavke` - Get all stavke
- `POST /api/stavke` - Create new stavke (requires auth)
- `PUT /api/stavke/:id` - Update stavke (requires auth)
- `DELETE /api/stavke/:id` - Delete stavke (requires auth)

### Tereni
- `GET /api/tereni` - Get all tereni
- `POST /api/tereni` - Create new tereni (requires auth)
- `PUT /api/tereni/:id` - Update tereni (requires auth)
- `DELETE /api/tereni/:id` - Delete tereni (requires auth)

### Health Check
- `GET /api/health` - Server health status

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Security Features

- Rate limiting (100 requests per 15 minutes per IP)
- CORS protection
- JWT authentication
- Environment-based configuration
- Input validation through MySQL prepared statements

## Development

The server uses nodemon for development, which automatically restarts when files change.

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Set up proper database credentials
4. Configure reverse proxy (nginx/Apache)
5. Set up SSL certificates