import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NewsArticle, ViewMode } from "../types";
import TikTokNewsFeed from "./TikTokNewsFeed";
import NewspaperView from "./NewspaperView";
import VerticalScrollView from "./VerticalScrollView";
import AudioMode from "./AudioMode";

const { width } = Dimensions.get("window");

interface ReadingModeSelectorProps {
  articles: NewsArticle[];
  currentIndex: number;
  onArticleChange: (article: NewsArticle, index: number) => void;
  onLike: (articleId: string) => void;
  onSave: (articleId: string) => void;
  onShare: (articleId: string) => void;
  onReadAloud: (articleId: string) => void;
  isSpeaking: boolean;
}

const ReadingModeSelector: React.FC<ReadingModeSelectorProps> = ({
  articles,
  currentIndex,
  onArticleChange,
  onLike,
  onSave,
  onShare,
  onReadAloud,
  isSpeaking,
}) => {
  const [currentMode, setCurrentMode] = useState<ViewMode>("card");
  const [showModeSelector, setShowModeSelector] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const modes = [
    {
      id: "card" as ViewMode,
      name: "Card View",
      description: "TikTok-style vertical swiping",
      icon: "phone-portrait",
      color: "#667eea",
    },
    {
      id: "newspaper" as ViewMode,
      name: "Newspaper View",
      description: "Traditional newspaper layout",
      icon: "newspaper",
      color: "#ff6b6b",
    },
    {
      id: "vertical" as ViewMode,
      name: "List View",
      description: "Vertical scrolling feed",
      icon: "list",
      color: "#4ecdc4",
    },
    {
      id: "audio" as ViewMode,
      name: "Audio Mode",
      description: "Listen to articles",
      icon: "volume-high",
      color: "#45b7d1",
    },
  ];

  const handleModeChange = (mode: ViewMode) => {
    setCurrentMode(mode);
    setShowModeSelector(false);
  };

  const toggleModeSelector = () => {
    const toValue = showModeSelector ? 0 : 1;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowModeSelector(!showModeSelector);
  };

  const renderCurrentMode = () => {
    const currentArticle = articles[currentIndex];

    switch (currentMode) {
      case "card":
        return (
          <TikTokNewsFeed
            articles={articles}
            onArticleChange={onArticleChange}
            onLike={onLike}
            onSave={onSave}
            onShare={onShare}
            onReadAloud={onReadAloud}
            currentIndex={currentIndex}
            isSpeaking={isSpeaking}
          />
        );

      case "newspaper":
        return (
          <NewspaperView
            articles={articles}
            currentIndex={currentIndex}
            onArticleChange={(index) => {
              const article = articles[index];
              if (article) {
                onArticleChange(article, index);
              }
            }}
            onLike={onLike}
            onSave={onSave}
            onShare={onShare}
            onReadAloud={onReadAloud}
            isSpeaking={isSpeaking}
          />
        );

      case "vertical":
        return (
          <VerticalScrollView
            articles={articles}
            onArticleSelect={(article) => {
              const index = articles.findIndex((a) => a.id === article.id);
              if (index !== -1) {
                onArticleChange(article, index);
              }
            }}
            onLike={onLike}
            onSave={onSave}
            onShare={onShare}
            onReadAloud={onReadAloud}
            isSpeaking={isSpeaking}
          />
        );

      case "audio":
        if (!currentArticle) return null;
        return (
          <AudioMode
            article={currentArticle}
            isPlaying={isSpeaking}
            onPlayPause={() => onReadAloud(currentArticle.id)}
            onStop={() => onReadAloud(currentArticle.id)}
            onNext={() => {
              const nextIndex = (currentIndex + 1) % articles.length;
              const nextArticle = articles[nextIndex];
              if (nextArticle) {
                onArticleChange(nextArticle, nextIndex);
              }
            }}
            onPrevious={() => {
              const prevIndex =
                (currentIndex - 1 + articles.length) % articles.length;
              const prevArticle = articles[prevIndex];
              if (prevArticle) {
                onArticleChange(prevArticle, prevIndex);
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  const getCurrentModeInfo = () => {
    return modes.find((mode) => mode.id === currentMode) || modes[0];
  };

  return (
    <View style={styles.container}>
      {renderCurrentMode()}

      {/* Mode Selector Button */}
      <TouchableOpacity style={styles.modeButton} onPress={toggleModeSelector}>
        <LinearGradient
          colors={[
            getCurrentModeInfo().color,
            getCurrentModeInfo().color + "80",
          ]}
          style={styles.modeButtonGradient}
        >
          <Ionicons
            name={getCurrentModeInfo().icon as any}
            size={24}
            color="#fff"
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* Mode Selector Modal */}
      <Modal
        visible={showModeSelector}
        transparent
        animationType="fade"
        onRequestClose={toggleModeSelector}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reading Mode</Text>
              <TouchableOpacity onPress={toggleModeSelector}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modesList}>
              {modes.map((mode) => (
                <TouchableOpacity
                  key={mode.id}
                  style={[
                    styles.modeItem,
                    currentMode === mode.id && styles.activeModeItem,
                  ]}
                  onPress={() => handleModeChange(mode.id)}
                >
                  <View style={styles.modeIconContainer}>
                    <Ionicons
                      name={mode.icon as any}
                      size={24}
                      color={currentMode === mode.id ? "#fff" : mode.color}
                    />
                  </View>

                  <View style={styles.modeInfo}>
                    <Text
                      style={[
                        styles.modeName,
                        currentMode === mode.id && styles.activeModeName,
                      ]}
                    >
                      {mode.name}
                    </Text>
                    <Text
                      style={[
                        styles.modeDescription,
                        currentMode === mode.id && styles.activeModeDescription,
                      ]}
                    >
                      {mode.description}
                    </Text>
                  </View>

                  {currentMode === mode.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  modeButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
  },
  activeModeItem: {
    backgroundColor: "#667eea",
  },
  modeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  modeInfo: {
    flex: 1,
  },
  modeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  activeModeName: {
    color: "#fff",
  },
  modeDescription: {
    fontSize: 14,
    color: "#666",
  },
  activeModeDescription: {
    color: "rgba(255,255,255,0.8)",
  },
});

export default ReadingModeSelector;
