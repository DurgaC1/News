# NewsFlow - Modern News Application

A modern, scalable, and highly engaging news application inspired by Particle News, SmartNews, and TikTok-style experiences. Built with React Native and Expo, featuring multiple reading modes, personalized feeds, and comprehensive offline capabilities.

## 🌟 Features

### Core Features

- **TikTok-Style Vertical Swipe Feed** - Smooth vertical scrolling with gesture-based navigation
- **Multiple Reading Modes** - Card View, Newspaper View, Vertical Scroll, and Audio Mode
- **Personalized News Feed** - AI-powered recommendations based on user preferences
- **Comprehensive Search** - Advanced search with filters and trending topics
- **Offline Reading** - Download articles for offline access
- **Text-to-Speech** - Listen to articles with customizable voices and speeds

### User Experience

- **Dark/Light Mode** - Smooth theme transitions with system preference detection
- **User Preferences** - Customizable news categories, sources, and languages
- **Reading Statistics** - Track reading time, articles read, and engagement metrics
- **Article Interactions** - Like, save, share, and bookmark articles
- **Reading History** - Keep track of all read articles
- **Daily Digest** - Personalized daily news summaries

### Technical Features

- **Modern UI/UX** - Beautiful gradients, smooth animations, and intuitive navigation
- **State Management** - Context API with Redux integration ready
- **Error Handling** - Comprehensive error states and loading indicators
- **Push Notifications** - Daily digest, breaking news, and personalized alerts
- **Offline Storage** - AsyncStorage for caching articles and user data
- **TypeScript** - Full type safety throughout the application

## 🏗️ Architecture

### Frontend Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── TikTokNewsFeed.tsx
│   │   ├── NewspaperView.tsx
│   │   ├── VerticalScrollView.tsx
│   │   ├── AudioMode.tsx
│   │   ├── ReadingModeSelector.tsx
│   │   ├── TabBar.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── StateHandlers.tsx
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── NewsContext.tsx
│   │   ├── CreditsContext.tsx
│   │   └── ThemeContext.tsx
│   ├── screens/             # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── PreferencesScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── SavedScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/            # Business logic and API services
│   │   ├── apiService.ts
│   │   ├── authService.ts
│   │   ├── newsService.ts
│   │   ├── mockDataService.ts
│   │   ├── offlineStorageService.ts
│   │   └── notificationService.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── utils/              # Utility functions
├── App.tsx                  # Main application component
└── package.json
```

### Backend Structure

```
backend/
├── src/
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication and error handling
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/            # Utility functions
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd newsapp
   ```

2. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd ../backend
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the backend directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/newsapp
   JWT_SECRET=your_secret_key_here
   NEWS_API_KEY=your_news_api_key
   NODE_ENV=development
   ```

5. **Start the development servers**

   Backend:

   ```bash
   cd backend
   npm run dev
   ```

   Frontend:

   ```bash
   cd frontend
   npm start
   ```

## 📱 Usage

### First Launch

1. **Authentication** - Choose from Guest, Developer, Google, or Facebook login
2. **Preferences Setup** - Select your news interests and preferred sources
3. **Explore** - Start browsing your personalized news feed

### Reading Modes

- **Card View** - TikTok-style vertical swiping
- **Newspaper View** - Traditional newspaper layout with typography controls
- **Vertical Scroll** - Continuous scrolling feed
- **Audio Mode** - Text-to-speech with customizable voices

### Features

- **Search** - Find articles by keywords, categories, or sources
- **Save Articles** - Bookmark articles for later reading
- **Reading History** - Track all your read articles
- **Profile** - Manage preferences and view reading statistics
- **Notifications** - Receive daily digests and breaking news alerts

## 🎨 Design System

### Color Palette

- **Primary**: #667eea (Blue gradient)
- **Secondary**: #764ba2 (Purple gradient)
- **Success**: #4ecdc4 (Teal)
- **Warning**: #ffa502 (Orange)
- **Error**: #ff4757 (Red)
- **Info**: #45b7d1 (Light blue)

### Typography

- **Headings**: Bold, 24-32px
- **Body**: Regular, 16px
- **Captions**: Regular, 12-14px
- **Line Height**: 1.5x for readability

### Spacing

- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px

## 🔧 Configuration

### Theme Configuration

The app supports both light and dark themes with automatic system preference detection. Themes can be customized in `src/contexts/ThemeContext.tsx`.

### Notification Settings

Configure push notifications in `src/services/notificationService.ts`:

- Daily digest timing
- Breaking news alerts
- Personalized notifications
- Reading milestones

### Offline Storage

Offline capabilities are managed by `src/services/offlineStorageService.ts`:

- Article caching
- User data persistence
- Reading history storage
- Settings synchronization

## 🧪 Testing

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Testing Features

- Unit tests for components and services
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance testing for smooth animations

## 📦 Deployment

### Frontend (Expo)

```bash
cd frontend
expo build:android
expo build:ios
```

### Backend (Node.js)

```bash
cd backend
npm run build
npm start
```

### Environment Setup

- Production environment variables
- Database configuration
- CDN setup for assets
- Monitoring and logging

## 🔒 Security

### Authentication

- JWT-based authentication
- Secure token storage
- Social login integration
- Session management

### Data Protection

- HTTPS enforcement
- Input validation
- SQL injection prevention
- XSS protection

## 📊 Performance

### Optimization Features

- Image lazy loading
- Article preloading
- Smooth animations with Reanimated
- Efficient state management
- Memory optimization

### Monitoring

- Performance metrics
- Error tracking
- User analytics
- Crash reporting

## 🤝 Contributing

### Development Guidelines

1. Follow TypeScript best practices
2. Use consistent code formatting
3. Write comprehensive tests
4. Document new features
5. Follow the existing architecture patterns

### Code Style

- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Component composition patterns

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Particle News, SmartNews, and TikTok
- Built with React Native and Expo
- Icons by Ionicons
- Gradients and animations for modern UX

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the FAQ section
- Contact the development team

---

**NewsFlow** - Bringing the future of news consumption to your fingertips. 📱✨
