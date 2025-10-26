# Authentication System Documentation

## Overview

The NewsApp backend now supports multiple authentication methods including email/password (local authentication) and social login options.

## Database Configuration

- **Database Name**: `newsdb`
- **Collections**:
  - `users` - User accounts with email/password and profile data
  - `news` - News articles

## Authentication Endpoints

### 1. Sign Up (Register with Email/Password)

**Endpoint**: `POST /api/auth/signup`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (Success - 201)**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://ui-avatars.com/api/?name=John+Doe&background=667eea&color=fff",
    "credits": 100,
    "preferences": {
      "categories": ["Technology", "World", "Business", "Science", "Health"],
      "sources": ["BBC", "CNN", "Reuters", "TechCrunch", "The Verge"],
      "languages": ["en"],
      "countries": ["us"]
    }
  }
}
```

**Response (Error - 400)**:

```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

### 2. Sign In (Login with Email/Password)

**Endpoint**: `POST /api/auth/signin`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 200)**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://ui-avatars.com/api/?name=John+Doe&background=667eea&color=fff",
    "credits": 100,
    "preferences": {
      "categories": ["Technology", "World", "Business"],
      "sources": ["BBC", "CNN"],
      "languages": ["en"],
      "countries": ["us"]
    }
  }
}
```

**Response (Error - 401)**:

```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

### 3. Verify Token

**Endpoint**: `GET /api/auth/verify`

**Headers**:

```
Authorization: Bearer <token>
```

**Response (Success - 200)**:

```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://ui-avatars.com/api/?name=John+Doe&background=667eea&color=fff",
    "credits": 100,
    "preferences": {
      "categories": ["Technology", "World", "Business"],
      "sources": ["BBC", "CNN"],
      "languages": ["en"],
      "countries": ["us"]
    }
  }
}
```

### 4. Update Profile

**Endpoint**: `PUT /api/user/profile`

**Headers**:

```
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "name": "Jane Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (Success - 200)**:

```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "Jane Doe",
    "avatar": "https://example.com/avatar.jpg",
    "credits": 100,
    "preferences": {...}
  }
}
```

### 5. Change Password

**Endpoint**: `PUT /api/user/change-password`

**Headers**:

```
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response (Success - 200)**:

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Response (Error - 401)**:

```json
{
  "success": false,
  "error": "Current password is incorrect"
}
```

## User Model

```javascript
{
  email: String (required, unique, lowercase),
  password: String (optional, minlength: 6),
  name: String (required),
  avatar: String,
  provider: String (enum: ['local', 'google', 'facebook', 'developer', 'guest']),
  providerId: String,
  credits: Number (default: 100),
  preferences: {
    categories: [String],
    sources: [String],
    languages: [String],
    countries: [String]
  },
  savedArticles: [ObjectId],
  readingHistory: [{
    articleId: String,
    readAt: Date
  }],
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Password Validation**: Minimum 6 characters
4. **Email Validation**: Lowercase and trim email addresses
5. **Token Expiration**: Configurable token expiration (default: 7 days)

## Testing

Run the database test script:

```bash
node test-db.js
```

This will test:

- Database connection
- User creation with email/password
- Password hashing and verification
- User queries and updates
- Preference management
- Collection verification

## Environment Variables

Required environment variables in `.env`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/newsdb
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
```

## Example Usage

### Register a New User

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Profile (requires authentication)

```bash
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Change Password

```bash
curl -X PUT http://localhost:3001/api/user/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword123"
  }'
```
