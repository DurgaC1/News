# NewsFlow Setup Guide

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm start
   ```

3. **Run on device/simulator**

   ```bash
   # For Android
   npm run android

   # For iOS
   npm run ios

   # For Web
   npm run web
   ```

## Building for Production

### Android Build

1. **Add Android platform**

   ```bash
   npm run cap:add:android
   ```

2. **Build the app**

   ```bash
   npm run cap:build:android
   ```

3. **Open in Android Studio**
   ```bash
   npm run cap:open:android
   ```

### iOS Build

1. **Add iOS platform**

   ```bash
   npm run cap:add:ios
   ```

2. **Build the app**

   ```bash
   npm run cap:build:ios
   ```

3. **Open in Xcode**
   ```bash
   npm run cap:open:ios
   ```

## Configuration

### OAuth Setup (Optional)

1. **Google OAuth**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Update `GOOGLE_CLIENT_ID` in `src/services/authService.ts`

2. **Facebook OAuth**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Get your App ID
   - Update `FACEBOOK_APP_ID` in `src/services/authService.ts`

### News API Integration

1. **Get API Key**

   - Sign up at [NewsAPI](https://newsapi.org/)
   - Get your API key

2. **Update Configuration**
   - Update `API_KEY` in `src/services/newsService.ts`
   - Uncomment the real API calls in the service

## Features Implemented

✅ **Authentication**

- Google OAuth login
- Facebook OAuth login
- Secure session management

✅ **User Experience**

- TikTok-style vertical scrolling
- Text-to-speech functionality
- Multiple view modes
- Smooth animations

✅ **News Features**

- Personalized news feed
- Save articles
- Reading history
- Search functionality
- Credits system

✅ **UI/UX**

- Modern gradient design
- Dark theme
- Responsive layout
- Loading screens

## Project Structure

```
src/
├── components/          # Reusable components
├── contexts/           # State management
├── navigation/         # App navigation
├── screens/           # Screen components
├── services/          # API services
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**

   ```bash
   npx expo start --clear
   ```

2. **Android build issues**

   ```bash
   cd android && ./gradlew clean
   ```

3. **iOS build issues**
   ```bash
   cd ios && pod install
   ```

### Dependencies

Make sure you have:

- Node.js (v16+)
- Expo CLI
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

## Next Steps

1. **Real API Integration**

   - Replace mock data with real news API
   - Implement proper error handling
   - Add offline support

2. **Enhanced Features**

   - Push notifications
   - Social sharing
   - Advanced personalization
   - Premium features

3. **Performance**

   - Image optimization
   - Lazy loading
   - Caching strategies

4. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

## Support

For issues and questions:

1. Check the README.md
2. Review the code comments
3. Open an issue in the repository
