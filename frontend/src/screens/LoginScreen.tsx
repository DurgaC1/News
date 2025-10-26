import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';
import { useNavigation } from '@react-navigation/native';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGuestLogin = async () => {
    try {
      const user = await AuthService.loginAsGuest();
      if (user) {
        login(user);
        navigation.replace('NewsFeed');
      } else {
        Alert.alert('Guest Login Error', 'Could not log in as guest. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Guest Login Error', error.message || 'Failed to log in as guest');
    }
  };

  const handleDeveloperLogin = async () => {
    try {
      const user = await AuthService.loginAsDeveloper();
      if (user) {
        login(user);
        navigation.replace('NewsFeed');
      } else {
        Alert.alert('Developer Login Error', 'Could not log in as developer. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Developer Login Error', error.message || 'Failed to log in as developer');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await AuthService.loginWithGoogle();
      if (user) {
        login(user);
        navigation.replace('Preferences', { isFirstTime: true });
      } else {
        Alert.alert('Google Login Error', 'Could not log in with Google. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Google Login Error', error.message || 'Failed to log in with Google');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const user = await AuthService.loginWithFacebook();
      if (user) {
        login(user);
        navigation.replace('Preferences', { isFirstTime: true });
      } else {
        Alert.alert('Facebook Login Error', 'Could not log in with Facebook. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Facebook Login Error', error.message || 'Failed to log in with Facebook');
    }
  };

  const handleEmailAuth = async () => {
    if (isSignUp && !name) {
      Alert.alert('Sign Up Error', 'Please enter your name.');
      return;
    }
    try {
      const user = isSignUp
        ? await AuthService.signupWithEmail(name, email, password)
        : await AuthService.loginWithEmail(email, password);
      if (user) {
        login(user);
        navigation.replace(isSignUp ? 'Preferences' : 'NewsFeed', { isFirstTime: isSignUp });
      } else {
        Alert.alert(isSignUp ? 'Sign Up Error' : 'Sign In Error', 'Authentication failed. Please try again.');
      }
    } catch (error: any) {
      Alert.alert(
        isSignUp ? 'Sign Up Error' : 'Sign In Error',
        error.message || (isSignUp ? 'Could not create account' : 'Invalid email or password')
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>N</Text>
        </View>
        <Text style={styles.title}>NewsFlow</Text>
        <Text style={styles.subtitle}>Stay informed, swipe through stories</Text>

        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleEmailAuth}>
          <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.toggleText}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={handleGoogleLogin}>
            <View style={styles.socialIconContainer}>
              <Text style={styles.socialIcon}>G</Text>
            </View>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, styles.facebookButton]} onPress={handleFacebookLogin}>
            <View style={styles.socialIconContainer}>
              <Text style={[styles.socialIcon, styles.fbIcon]}>f</Text>
            </View>
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGuestLogin}>
          <Text style={styles.buttonText}>Continue as Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.developerButton} onPress={handleDeveloperLogin}>
          <Text style={styles.developerButtonText}>Developer Mode</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#4263eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 320,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  socialButtonsContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    pointerEvents: 'auto', // Explicitly set to avoid warning
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  facebookButton: {
    backgroundColor: '#1877f2',
  },
  socialIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  fbIcon: {
    color: '#ffffff',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#6c757d',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4263eb',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#4263eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    pointerEvents: 'auto', // Explicitly set to avoid warning
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleText: {
    color: '#4263eb',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
  developerButton: {
    marginTop: 15,
    padding: 10,
    pointerEvents: 'auto', // Explicitly set to avoid warning
  },
  developerButtonText: {
    color: '#6c757d',
    fontSize: 14,
  },
});

export default LoginScreen;