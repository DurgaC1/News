import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, TextInput, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGuestLogin = async () => {
    const user = await AuthService.loginAsGuest();
    if (user) {
      login(user);
    }
  };

  const handleDeveloperLogin = async () => {
    const user = await AuthService.loginAsDeveloper();
    if (user) {
      login(user);
    }
  };

  const handleGoogleLogin = async () => {
    const user = await AuthService.loginWithGoogle();
    if (user) {
      login(user);
    }
  };

  const handleFacebookLogin = async () => {
    const user = await AuthService.loginWithFacebook();
    if (user) {
      login(user);
    }
  };

  const handleEmailAuth = async () => {
    if (isSignUp) {
      if (!name) {
        Alert.alert('Sign Up Error', 'Please enter your name.');
        return;
      }
      const user = await AuthService.signupWithEmail(name, email, password);
      if (user) {
        login(user);
      } else {
        Alert.alert('Sign Up Error', 'Could not create an account. Please try again.');
      }
    } else {
      const user = await AuthService.loginWithEmail(email, password);
      if (user) {
        login(user);
      } else {
        Alert.alert('Sign In Error', 'Invalid email or password. Please try again.');
      }
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
          <TouchableOpacity 
            style={[styles.socialButton, styles.googleButton]} 
            onPress={handleGoogleLogin}
          >
            <View style={styles.socialIconContainer}>
              <Text style={styles.socialIcon}>G</Text>
            </View>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.socialButton, styles.facebookButton]} 
            onPress={handleFacebookLogin}
          >
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
  },
  developerButtonText: {
    color: '#6c757d',
    fontSize: 14,
  },
});

export default LoginScreen;
