import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./src/contexts/AuthContext";
import { NewsProvider } from "./src/contexts/NewsContext";
import { CreditsProvider } from "./src/contexts/CreditsContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthProvider>
          <CreditsProvider>
            <NewsProvider>
              <AppNavigator />
              <StatusBar style="light" />
            </NewsProvider>
          </CreditsProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
