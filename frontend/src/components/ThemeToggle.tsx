import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");

interface ThemeToggleProps {
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  style?: any;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = "medium",
  showLabel = false,
  style,
}) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const getSize = () => {
    switch (size) {
      case "small":
        return 40;
      case "medium":
        return 50;
      case "large":
        return 60;
      default:
        return 50;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "small":
        return 20;
      case "medium":
        return 24;
      case "large":
        return 28;
      default:
        return 24;
    }
  };

  const handlePress = () => {
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotation animation
    Animated.timing(rotateAnim, {
      toValue: rotateAnim._value + 180,
      duration: 300,
      useNativeDriver: true,
    }).start();

    toggleTheme();
  };

  const iconName = isDarkMode ? "sunny" : "moon";
  const buttonSize = getSize();
  const iconSize = getIconSize();

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.buttonContent,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              transform: [
                { scale: scaleAnim },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={
              isDarkMode ? ["#ffa502", "#ff6348"] : ["#667eea", "#764ba2"]
            }
            style={styles.gradient}
          >
            <Ionicons name={iconName} size={iconSize} color="#fff" />
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      {showLabel && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: "500",
  },
});

export default ThemeToggle;
