#!/bin/bash

# NewsApp Dependencies Installation Script
echo "Installing NewsApp dependencies..."

# Install npm dependencies
echo "Installing npm packages..."
npm install

# Install expo-constants if not already installed
echo "Installing expo-constants..."
npx expo install expo-constants

echo "Dependencies installed successfully!"
echo ""
echo "Quick Start (Developer Mode):"
echo "1. Run 'npm start' to start the development server"
echo "2. Tap 'Developer Mode' on the login screen (no setup required!)"
echo "3. Start testing the app immediately"
echo ""
echo "Full Setup (Optional):"
echo "1. Get your NewsAPI key from https://newsapi.org/"
echo "2. Set up Google OAuth at https://console.developers.google.com/"
echo "3. Set up Facebook OAuth at https://developers.facebook.com/"
echo "4. Update the API keys in app.json and src/services/"
echo ""
echo "See SETUP_GUIDE.md for detailed instructions."
