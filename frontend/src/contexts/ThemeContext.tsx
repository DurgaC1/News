import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
}

const lightTheme: Theme = {
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    background: "#ffffff",
    surface: "#f8f9fa",
    text: "#333333",
    textSecondary: "#666666",
    border: "#e0e0e0",
    accent: "#667eea",
    success: "#4ecdc4",
    warning: "#ffa502",
    error: "#ff4757",
    info: "#45b7d1",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

const darkTheme: Theme = {
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    background: "#1a1a1a",
    surface: "#2a2a2a",
    text: "#ffffff",
    textSecondary: "#cccccc",
    border: "#333333",
    accent: "#667eea",
    success: "#4ecdc4",
    warning: "#ffa502",
    error: "#ff4757",
    info: "#45b7d1",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark" | "auto") => void;
  currentThemeMode: "light" | "dark" | "auto";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentThemeMode, setCurrentThemeMode] = useState<
    "light" | "dark" | "auto"
  >("auto");

  useEffect(() => {
    // Listen to system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (currentThemeMode === "auto") {
        setIsDarkMode(colorScheme === "dark");
      }
    });

    // Set initial theme based on system preference
    if (currentThemeMode === "auto") {
      setIsDarkMode(Appearance.getColorScheme() === "dark");
    }

    return () => subscription?.remove();
  }, [currentThemeMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setCurrentThemeMode(isDarkMode ? "light" : "dark");
  };

  const setTheme = (mode: "light" | "dark" | "auto") => {
    setCurrentThemeMode(mode);

    if (mode === "auto") {
      setIsDarkMode(Appearance.getColorScheme() === "dark");
    } else {
      setIsDarkMode(mode === "dark");
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
    currentThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export { lightTheme, darkTheme };
export type { Theme };
