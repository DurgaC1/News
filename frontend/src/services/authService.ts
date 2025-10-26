import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { User, NewsPreferences } from '../types';
import apiService from './apiService';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
// Get your Google Client ID from: https://console.developers.google.com/
const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId || 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri();

// Facebook OAuth configuration
// Get your Facebook App ID from: https://developers.facebook.com/
const FACEBOOK_APP_ID = Constants.expoConfig?.extra?.facebookAppId || 'YOUR_FACEBOOK_APP_ID_HERE';

export class AuthService {
  static async loginAsDeveloper(): Promise<User | null> {
    try {
      const response = await apiService.loginAsDeveloper();
      
      if (response.success) {
        // Set the token for future API calls
        apiService.setToken(response.token);
        
        return {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          avatar: response.user.avatar,
          preferences: response.user.preferences,
          credits: response.user.credits,
          savedArticles: [],
          readingHistory: [],
        };
      }
      
      return null;
    } catch (error) {
      console.error('Developer login error:', error);
      return null;
    }
  }

  static async loginAsGuest(): Promise<User | null> {
    try {
      const response = await apiService.loginAsGuest();
      
      if (response.success) {
        // Set the token for future API calls
        apiService.setToken(response.token);
        
        return {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          avatar: response.user.avatar,
          preferences: response.user.preferences,
          credits: response.user.credits,
          savedArticles: [],
          readingHistory: [],
        };
      }
      
      return null;
    } catch (error) {
      console.error('Guest login error:', error);
      return null;
    }
  }

  static async loginWithGoogle(): Promise<User | null> {
    try {
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: GOOGLE_REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {},
        prompt: AuthSession.Prompt.SelectAccount,
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      if (result.type === 'success') {
        // Exchange code for token
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: GOOGLE_CLIENT_ID,
            code: result.params.code || '',
            redirectUri: GOOGLE_REDIRECT_URI,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
          },
          {
            tokenEndpoint: 'https://oauth2.googleapis.com/token',
          }
        );

        // Get user info
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.accessToken}`
        );
        const userInfo = await userInfoResponse.json();

        // Send to backend
        const response = await apiService.loginWithGoogle({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          googleId: userInfo.id,
        });

        if (response.success) {
          apiService.setToken(response.token);
          
          return {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            avatar: response.user.avatar,
            preferences: response.user.preferences,
            credits: response.user.credits,
            savedArticles: [],
            readingHistory: [],
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Google login error:', error);
      return null;
    }
  }

  static async loginWithFacebook(): Promise<User | null> {
    try {
      const request = new AuthSession.AuthRequest({
        clientId: FACEBOOK_APP_ID,
        scopes: ['public_profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri(),
        responseType: AuthSession.ResponseType.Token,
        extraParams: {},
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
      });

      if (result.type === 'success' && result.authentication?.accessToken) {
        // Get user info
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${result.authentication.accessToken}`
        );
        const userInfo = await userInfoResponse.json();

        // Send to backend
        const response = await apiService.loginWithFacebook({
          email: userInfo.email || '',
          name: userInfo.name,
          picture: userInfo.picture,
          facebookId: userInfo.id,
        });

        if (response.success) {
          apiService.setToken(response.token);
          
          return {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            avatar: response.user.avatar,
            preferences: response.user.preferences,
            credits: response.user.credits,
            savedArticles: [],
            readingHistory: [],
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Facebook login error:', error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    // Clear token
    apiService.setToken(null);
    console.log('Logged out user');
  }

  static async verifyToken(): Promise<User | null> {
    try {
      const response = await apiService.verifyToken();
      
      if (response.success) {
        return {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          avatar: response.user.avatar,
          preferences: response.user.preferences,
          credits: response.user.credits,
          savedArticles: [],
          readingHistory: [],
        };
      }
      
      return null;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  static async updatePreferences(preferences: NewsPreferences): Promise<User | null> {
    try {
      const response = await apiService.updatePreferences(preferences);
      
      if (response.success) {
        return {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          avatar: response.user.avatar,
          preferences: response.user.preferences,
          credits: response.user.credits,
          savedArticles: response.user.savedArticles || [],
          readingHistory: response.user.readingHistory || [],
        };
      }
      
      return null;
    } catch (error) {
      console.error('Update preferences error:', error);
      return null;
    }
  }
}
