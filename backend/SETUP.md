# NewsApp Backend Setup

## Prerequisites
- Node.js >= 18.0.0
- MongoDB installed and running
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/newsdb

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:19006

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

3. Make sure MongoDB is running:
```bash
mongod
```

4. Start the server:
```bash
npm run dev
```

## Database Configuration

The application uses:
- **Database Name**: `newsdb`
- **Collections**: 
  - `users` - User accounts
  - `articles` - News articles

## API Endpoints

### Authentication

#### Sign Up (Email/Password)
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Sign In (Email/Password)
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### User Management

All user endpoints require authentication.

```http
GET /api/user/profile
Authorization: Bearer <token>
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time
- `MONGODB_URI` - MongoDB connection string
- `CORS_ORIGIN` - Allowed CORS origins
