import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");

export interface ErrorState {
  message: string;
  code?: string;
  retry?: () => void;
  showRetry?: boolean;
}

interface LoadingState {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

interface EmptyState {
  title: string;
  subtitle: string;
  icon: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

// Loading Component
export const LoadingSpinner: React.FC<{
  size?: "small" | "large";
  color?: string;
  message?: string;
}> = ({ size = "large", color, message }) => {
  const { theme } = useTheme();
  const spinAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <ActivityIndicator size={size} color={color || theme.colors.primary} />
      </Animated.View>
      {message && (
        <Text
          style={[styles.loadingMessage, { color: theme.colors.textSecondary }]}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

// Error Component
export const ErrorDisplay: React.FC<{
  error: ErrorState;
  onRetry?: () => void;
}> = ({ error, onRetry }) => {
  const { theme } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRetry = () => {
    if (error.retry) {
      error.retry();
    } else if (onRetry) {
      onRetry();
    }
  };

  return (
    <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
      <View
        style={[styles.errorContent, { backgroundColor: theme.colors.surface }]}
      >
        <Ionicons
          name="alert-circle"
          size={48}
          color={theme.colors.error}
          style={styles.errorIcon}
        />

        <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
          Oops! Something went wrong
        </Text>

        <Text
          style={[styles.errorMessage, { color: theme.colors.textSecondary }]}
        >
          {error.message}
        </Text>

        {error.code && (
          <Text
            style={[styles.errorCode, { color: theme.colors.textSecondary }]}
          >
            Error Code: {error.code}
          </Text>
        )}

        {error.showRetry !== false && (
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleRetry}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// Empty State Component
export const EmptyState: React.FC<{
  state: EmptyState;
}> = ({ state }) => {
  const { theme } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
      <View style={styles.emptyContent}>
        <Ionicons
          name={state.icon as any}
          size={64}
          color={theme.colors.textSecondary}
          style={styles.emptyIcon}
        />

        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          {state.title}
        </Text>

        <Text
          style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}
        >
          {state.subtitle}
        </Text>

        {state.action && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={state.action.onPress}
          >
            <Text style={styles.actionButtonText}>{state.action.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// Progress Bar Component
export const ProgressBar: React.FC<{
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
}> = ({ progress, height = 4, color, backgroundColor, animated = true }) => {
  const { theme } = useTheme();
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(progress);
    }
  }, [progress, animated]);

  return (
    <View
      style={[
        styles.progressBar,
        {
          height,
          backgroundColor: backgroundColor || theme.colors.border,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.progressFill,
          {
            height,
            backgroundColor: color || theme.colors.primary,
            width: progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
};

// Loading Overlay Component
export const LoadingOverlay: React.FC<{
  visible: boolean;
  message?: string;
  progress?: number;
}> = ({ visible, message, progress }) => {
  const { theme } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          backgroundColor: theme.colors.background + "90",
          opacity: fadeAnim,
        },
      ]}
    >
      <View
        style={[
          styles.overlayContent,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <LoadingSpinner message={message} />
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} />
            <Text
              style={[
                styles.progressText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {Math.round(progress)}%
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// Network Status Component
export const NetworkStatus: React.FC<{
  isConnected: boolean;
  onRetry?: () => void;
}> = ({ isConnected, onRetry }) => {
  const { theme } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isConnected ? -100 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected]);

  if (isConnected) return null;

  return (
    <Animated.View
      style={[
        styles.networkStatus,
        {
          backgroundColor: theme.colors.error,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Ionicons name="wifi-outline" size={20} color="#fff" />
      <Text style={styles.networkText}>No internet connection</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry}>
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// Generic State Handler Component
export const StateHandler: React.FC<{
  isLoading: boolean;
  error: ErrorState | null;
  isEmpty: boolean;
  emptyState?: EmptyState;
  children: ReactNode;
  loadingMessage?: string;
  onRetry?: () => void;
}> = ({
  isLoading,
  error,
  isEmpty,
  emptyState,
  children,
  loadingMessage,
  onRetry,
}) => {
  if (isLoading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} />;
  }

  if (isEmpty && emptyState) {
    return <EmptyState state={emptyState} />;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingMessage: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContent: {
    alignItems: "center",
    padding: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: width - 40,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
  errorCode: {
    fontSize: 12,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyContent: {
    alignItems: "center",
    maxWidth: width - 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  progressBar: {
    width: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    borderRadius: 2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlayContent: {
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  progressContainer: {
    width: 200,
    marginTop: 20,
  },
  progressText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  networkStatus: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  networkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
    marginRight: 8,
  },
});

export default {
  LoadingSpinner,
  ErrorDisplay,
  EmptyState,
  ProgressBar,
  LoadingOverlay,
  NetworkStatus,
  StateHandler,
};
