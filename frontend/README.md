# NewsApp Frontend

Frontend for the NewsApp mobile application built with React Native and Expo.

## Features

- Cross-platform mobile app (iOS, Android, Web)
- User authentication (Guest, Developer, Google, Facebook)
- News feed with swiping navigation
- User credits system
- Save articles and reading history

## Setup

1. **Install dependencies:**

   ```bash
   cd NewsApp-Frontend
   npm install
   ```

2. **Configure the API URL:**
   Edit `src/services/apiService.ts` to set your backend URL:

   ```typescript
   const API_BASE_URL = __DEV__
     ? "http://localhost:3000/api" // Development
     : "https://your-production-api.com/api"; // Production
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Run on specific platform:**
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS
   npm run web      # For Web
   ```

## Development

- **Expo Go**: Scan QR code with Expo Go app
- **Android Emulator**: Press 'a' in the terminal
- **iOS Simulator**: Press 'i' in the terminal
- **Web Browser**: Press 'w' in the terminal

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth, News, Credits)
├── hooks/          # Custom React hooks
├── navigation/     # Navigation configuration
├── screens/        # Screen components
├── services/       # API services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Context API
- Expo Auth Session

## License

MIT
