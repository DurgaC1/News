# NewsApp Backend

Backend API for the NewsApp application built with Node.js, Express, and MongoDB.

## Features

- RESTful API for news articles
- User authentication (JWT-based)
- MongoDB database integration
- News API integration
- Rate limiting and security features

## Setup

1. **Install dependencies:**

   ```bash
   cd NewsApp-Backend
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/newsapp
   JWT_SECRET=your_secret_key_here
   NEWS_API_KEY=your_news_api_key
   NODE_ENV=development
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Start the production server:**
   ```bash
   npm start
   ```

## API Endpoints

- `GET /api/news` - Get top headlines
- `POST /api/news/search` - Search news
- `GET /api/news/:category` - Get news by category
- `POST /api/auth/developer` - Login as developer
- `POST /api/auth/guest` - Login as guest
- `POST /api/auth/google` - Login with Google
- `POST /api/auth/facebook` - Login with Facebook

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Axios
- dotenv

## License

MIT
