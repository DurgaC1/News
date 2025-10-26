import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { User, NewsPreferences } from '../types';
import apiService from './apiService';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId || 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri();

// Facebook OAuth configuration
const FACEBOOK_APP_ID = Constants.expoConfig?.extra?.facebookAppId || 'YOUR_FACEBOOK_APP_ID_HERE';

export class AuthService {
  static async loginAsDeveloper(): Promise<User | null> {
    try {
      const response = await apiService.loginAsDeveloper();
      
      if (response.success) {
        apiService.setToken(response.token);
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
      
      throw new Error(response.error || 'Developer login failed');
    } catch (error: any) {
      console.error('Developer login error:', error.message);
      throw new Error(error.message || 'Failed to login as developer');
    }
  }

  static async loginAsGuest(): Promise<User | null> {
    try {
      const response = await apiService.loginAsGuest();
      
      if (response.success) {
        apiService.setToken(response.token);
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
      
      throw new Error(response.error || 'Guest login failed');
    } catch (error: any) {
      console.error('Guest login error:', error.message);
      throw new Error(error.message || 'Failed to login as guest');
    }
  }

  static async loginWithEmail(email: string, password: string): Promise<User | null> {
    try {
      const response = await apiService.loginWithEmail({ email, password });

      if (response.success) {
        apiService.setToken(response.token);
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

      throw new Error(response.error || 'Email login failed');
    } catch (error: any) {
      console.error('Email login error:', error.message);
      throw new Error(error.message || 'Failed to login with email');
    }
  }

  static async signupWithEmail(name: string, email: string, password: string): Promise<User | null> {
    try {
      const response = await apiService.signupWithEmail({ name, email, password });

      if (response.success) {
        apiService.setToken(response.token);
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

      throw new Error(response.error || 'Email signup failed');
    } catch (error: any) {
      console.error('Email signup error:', error.message);
      throw new Error(error.message || 'Failed to signup with email');
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
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: GOOGLE_CLIENT_ID,
            code: result.params.code || '',
            redirectUri: GOOGLE_REDIRECT_URI,
            extraParams: {
              code_verifier: request.codeVerifier || '',
            },
          },
          {
            tokenEndpoint: 'https://oauth2.googleapis.com/token',
          }
        );

        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.accessToken}`
        );
        const userInfo = await userInfoResponse.json();

        if (!userInfo.email || !userInfo.name) {
          throw new Error('Google user info missing email or name');
        }

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
            savedArticles: response.user.savedArticles || [],
            readingHistory: response.user.readingHistory || [],
          };
        }

        throw new Error(response.error || 'Google login failed');
      }

      throw new Error('Google OAuth flow cancelled');
    } catch (error: any) {
      console.error('Google login error:', error.message);
      throw new Error(error.message || 'Failed to login with Google');
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
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${result.authentication.accessToken}`
        );
        const userInfo = await userInfoResponse.json();

        if (!userInfo.email || !userInfo.name) {
          throw new Error('Facebook user info missing email or name');
        }

        const response = await apiService.loginWithFacebook({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture?.data?.url || '', // Align with backend expectation
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
            savedArticles: response.user.savedArticles || [],
            readingHistory: response.user.readingHistory || [],
          };
        }

        throw new Error(response.error || 'Facebook login failed');
      }

      throw new Error('Facebook OAuth flow cancelled');
    } catch (error: any) {
      console.error('Facebook login error:', error.message);
      throw new Error(error.message || 'Failed to login with Facebook');
    }
  }

  static async logout(): Promise<void> {
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
          savedArticles: response.user.savedArticles || [],
          readingHistory: response.user.readingHistory || [],
        };
      }
      
      throw new Error(response.error || 'Token verification failed');
    } catch (error: any) {
      console.error('Token verification error:', error.message);
      throw new Error(error.message || 'Failed to verify token');
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
      
      throw new Error(response.error || 'Update preferences failed');
    } catch (error: any) {
      console.error('Update preferences error:', error.message);
      throw new Error(error.message || 'Failed to update preferences');
    }
  }

  static async getUserProfile(): Promise<User | null> {
    try {
      const response = await apiService.getUserProfile();
      
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
      
      throw new Error(response.error || 'Failed to fetch user profile');
    } catch (error: any) {
      console.error('Get user profile error:', error.message);
      throw new Error(error.message || 'Failed to fetch user profile');
    }
  }

  static async updateProfile(profile: { name?: string; avatar?: string }): Promise<User | null> {
    try {
      const response = await apiService.updateProfile(profile);
      
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
      
      throw new Error(response.error || 'Update profile failed');
    } catch (error: any) {
      console.error('Update profile error:', error.message);
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string } | null> {
    try {
      const response = await apiService.changePassword({ currentPassword, newPassword });
      
      if (response.success) {
        return { message: response.message };
      }
      
      throw new Error(response.error || 'Change password failed');
    } catch (error: any) {
      console.error('Change password error:', error.message);
      throw new Error(error.message || 'Failed to change password');
    }
  }

  static async saveArticle(articleId: string): Promise<{ message: string; savedArticles: string[] } | null> {
    try {
      const response = await apiService.saveArticle(articleId);
      
      if (response.success) {
        return {
          message: response.message,
          savedArticles: response.savedArticles || [],
        };
      }
      
      throw new Error(response.error || 'Save article failed');
    } catch (error: any) {
      console.error('Save article error:', error.message);
      throw new Error(error.message || 'Failed to save article');
    }
  }

  static async removeSavedArticle(articleId: string): Promise<{ message: string; savedArticles: string[] } | null> {
    try {
      const response = await apiService.removeSavedArticle(articleId);
      
      if (response.success) {
        return {
          message: response.message,
          savedArticles: response.savedArticles || [],
        };
      }
      
      throw new Error(response.error || 'Remove saved article failed');
    } catch (error: any) {
      console.error('Remove saved article error:', error.message);
      throw new Error(error.message || 'Failed to remove saved article');
    }
  }

  static async addToReadingHistory(articleId: string): Promise<{ message: string; readingHistory: { articleId: string; readAt: string }[] } | null> {
    try {
      const response = await apiService.addToReadingHistory(articleId);
      
      if (response.success) {
        return {
          message: response.message,
          readingHistory: response.readingHistory || [],
        };
      }
      
      throw new Error(response.error || 'Add to reading history failed');
    } catch (error: any) {
      console.error('Add to reading history error:', error.message);
      throw new Error(error.message || 'Failed to add to reading history');
    }
  }

  static async getSavedArticles(): Promise<{ articles: string[] } | null> {
    try {
      const response = await apiService.getSavedArticles();
      
      if (response.success) {
        return { articles: response.articles || [] };
      }
      
      throw new Error(response.error || 'Fetch saved articles failed');
    } catch (error: any) {
      console.error('Fetch saved articles error:', error.message);
      throw new Error(error.message || 'Failed to fetch saved articles');
    }
  }

  static async getReadingHistory(): Promise<{ readingHistory: { articleId: string; readAt: string }[] } | null> {
    try {
      const response = await apiService.getReadingHistory();
      
      if (response.success) {
        return { readingHistory: response.readingHistory || [] };
      }
      
      throw new Error(response.error || 'Fetch reading history failed');
    } catch (error: any) {
      console.error('Fetch reading history error:', error.message);
      throw new Error(error.message || 'Failed to fetch reading history');
    }
  }
}