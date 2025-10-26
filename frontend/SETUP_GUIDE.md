# NewsApp Setup Guide

This guide will help you set up the NewsApp with NewsAPI integration and Google/Facebook authentication.

## 1. Developer Mode (No Login Required)

For development and testing purposes, the app includes a **Developer Mode** that bypasses all authentication requirements.

### How to Use Developer Mode:

1. On the login screen, tap the **"Developer Mode"** button (⚡)
2. You'll be automatically logged in as a developer user
3. The developer user has:
   - 1000 credits (extra for testing)
   - All news categories enabled
   - Premium news sources access
   - No authentication required

### Developer User Details:

- **Name**: Developer User
- **Email**: developer@newsapp.com
- **Credits**: 1000
- **Preferences**: All categories and premium sources

This mode is perfect for:

- Testing the app without setting up OAuth
- Development and debugging
- Demonstrating features to stakeholders
- Quick access to all app functionality

## 2. NewsAPI Setup

### Step 1: Get your NewsAPI Key

1. Go to [https://newsapi.org/](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Replace `YOUR_NEWS_API_KEY_HERE` in `src/services/newsService.ts` with your actual API key

### Step 2: API Key Configuration

```typescript
// In src/services/newsService.ts
private static readonly API_KEY = 'your-actual-api-key-here';
```

## 2. Google Authentication Setup

### Step 1: Create Google OAuth Project

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Choose "Web application" for the application type
6. Add authorized redirect URIs:
   - For development: `https://auth.expo.io/@your-expo-username/your-app-slug`
   - For production: Your app's redirect URI

### Step 2: Configure Google Client ID

```typescript
// In src/services/authService.ts
const GOOGLE_CLIENT_ID = "your-google-client-id.apps.googleusercontent.com";
```

### Step 3: Update app.json

Add the following to your `app.json`:

```json
{
  "expo": {
    "scheme": "yourapp",
    "plugins": [
      [
        "expo-auth-session",
        {
          "schemes": ["yourapp"]
        }
      ]
    ]
  }
}
```

## 3. Facebook Authentication Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs:
   - For development: `https://auth.expo.io/@your-expo-username/your-app-slug`
   - For production: Your app's redirect URI

### Step 2: Configure Facebook App ID

```typescript
// In src/services/authService.ts
const FACEBOOK_APP_ID = "your-facebook-app-id";
```

### Step 3: Update app.json

Add Facebook configuration to your `app.json`:

```json
{
  "expo": {
    "facebookAppId": "your-facebook-app-id",
    "facebookDisplayName": "Your App Name",
    "plugins": [
      [
        "expo-facebook",
        {
          "appID": "your-facebook-app-id"
        }
      ]
    ]
  }
}
```

## 4. Environment Variables (Recommended)

For better security, use environment variables:

### Step 1: Install expo-constants

```bash
npm install expo-constants
```

### Step 2: Create .env file

```env
NEWS_API_KEY=your-news-api-key
GOOGLE_CLIENT_ID=your-google-client-id
FACEBOOK_APP_ID=your-facebook-app-id
```

### Step 3: Update services to use environment variables

```typescript
import Constants from "expo-constants";

const NEWS_API_KEY =
  Constants.expoConfig?.extra?.newsApiKey || "YOUR_NEWS_API_KEY_HERE";
const GOOGLE_CLIENT_ID =
  Constants.expoConfig?.extra?.googleClientId || "YOUR_GOOGLE_CLIENT_ID_HERE";
const FACEBOOK_APP_ID =
  Constants.expoConfig?.extra?.facebookAppId || "YOUR_FACEBOOK_APP_ID_HERE";
```

## 5. Testing the Setup

### Test Developer Mode (Recommended for Quick Testing)

1. Run the app: `npm start`
2. Tap "Developer Mode" on the login screen
3. You should be automatically logged in
4. Navigate to the news feed and verify everything works

### Test NewsAPI

1. Run the app: `npm start`
2. Use Developer Mode or any login method
3. Navigate to the news feed
4. Check if real news articles are loading

### Test Google Authentication

1. Tap "Continue with Google" on the login screen
2. Complete the OAuth flow
3. Verify user data is retrieved correctly

### Test Facebook Authentication

1. Tap "Continue with Facebook" on the login screen
2. Complete the OAuth flow
3. Verify user data is retrieved correctly

## 6. Troubleshooting

### Common Issues:

1. **NewsAPI 401 Error**: Check your API key and ensure it's correctly set
2. **Google OAuth Error**: Verify redirect URIs match exactly
3. **Facebook OAuth Error**: Check app ID and ensure Facebook Login is enabled
4. **CORS Issues**: Use Expo's development server for testing

### Debug Tips:

- Check console logs for detailed error messages
- Verify all API keys are correctly formatted
- Ensure redirect URIs match your app configuration
- Test with different browsers/devices

## 7. Production Deployment

### Before deploying:

1. Update all placeholder API keys with production keys
2. Configure production redirect URIs
3. Test all authentication flows
4. Ensure NewsAPI quota limits are appropriate for your app

### Security Notes:

- Never commit API keys to version control
- Use environment variables for sensitive data
- Implement proper error handling
- Consider rate limiting for API calls
