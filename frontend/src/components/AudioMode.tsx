import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Slider,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { NewsArticle } from "../types";

const { width, height } = Dimensions.get("window");

interface AudioModeProps {
  article: NewsArticle;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AudioMode: React.FC<AudioModeProps> = ({
  article,
  isPlaying,
  onPlayPause,
  onStop,
  onNext,
  onPrevious,
}) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [voice, setVoice] = useState("default");
  const [isLoading, setIsLoading] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const voices = [
    { id: "default", name: "Default", language: "en" },
    { id: "female", name: "Female", language: "en" },
    { id: "male", name: "Male", language: "en" },
  ];

  useEffect(() => {
    if (isPlaying) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [isPlaying]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePlayPause = async () => {
    setIsLoading(true);

    try {
      if (isPlaying) {
        Speech.pause();
      } else {
        const textToSpeak = `${article.title}. ${article.description}. ${article.content}`;

        await Speech.speak(textToSpeak, {
          language: "en",
          pitch: 1.0,
          rate: playbackSpeed,
          onStart: () => {
            setIsLoading(false);
            onPlayPause();
          },
          onDone: () => {
            onStop();
          },
          onStopped: () => {
            onStop();
          },
        });
      }
    } catch (error) {
      console.error("Speech error:", error);
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    Speech.stop();
    onStop();
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      Speech.stop();
      handlePlayPause();
    }
  };

  const handleVoiceChange = (newVoice: string) => {
    setVoice(newVoice);
    if (isPlaying) {
      Speech.stop();
      handlePlayPause();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCurrentVoice = () => {
    return voices.find((v) => v.id === voice) || voices[0];
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <View style={styles.content}>
        {/* Article Info */}
        <View style={styles.articleInfo}>
          <Text style={styles.source}>{article.source}</Text>
          <Text style={styles.category}>{article.category}</Text>
        </View>

        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>

        <Text style={styles.author}>By {article.author}</Text>

        {/* Audio Visualizer */}
        <View style={styles.visualizerContainer}>
          <Animated.View
            style={[
              styles.visualizer,
              {
                transform: [{ scale: pulseAnim }],
                opacity: isPlaying ? 1 : 0.6,
              },
            ]}
          >
            <Ionicons
              name={isPlaying ? "volume-high" : "volume-mute"}
              size={60}
              color="#fff"
            />
          </Animated.View>

          {isPlaying && (
            <View style={styles.waveContainer}>
              {[...Array(5)].map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.wave,
                    {
                      height: 20 + Math.random() * 30,
                      animationDelay: index * 100,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "30%" }]} />
          </View>
          <Text style={styles.timeText}>
            {formatTime(duration || article.readTime * 60)}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={onPrevious}>
            <Ionicons name="play-skip-back" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, isLoading && styles.loadingButton]}
            onPress={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <Ionicons name="hourglass" size={40} color="#fff" />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={40}
                color="#fff"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={onNext}>
            <Ionicons name="play-skip-forward" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Speed Control */}
        <View style={styles.speedContainer}>
          <Text style={styles.speedLabel}>Playback Speed</Text>
          <View style={styles.speedButtons}>
            {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.speedButton,
                  playbackSpeed === speed && styles.activeSpeedButton,
                ]}
                onPress={() => handleSpeedChange(speed)}
              >
                <Text
                  style={[
                    styles.speedText,
                    playbackSpeed === speed && styles.activeSpeedText,
                  ]}
                >
                  {speed}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Voice Selection */}
        <View style={styles.voiceContainer}>
          <Text style={styles.voiceLabel}>Voice</Text>
          <View style={styles.voiceButtons}>
            {voices.map((voiceOption) => (
              <TouchableOpacity
                key={voiceOption.id}
                style={[
                  styles.voiceButton,
                  voice === voiceOption.id && styles.activeVoiceButton,
                ]}
                onPress={() => handleVoiceChange(voiceOption.id)}
              >
                <Text
                  style={[
                    styles.voiceText,
                    voice === voiceOption.id && styles.activeVoiceText,
                  ]}
                >
                  {voiceOption.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Controls */}
        <View style={styles.additionalControls}>
          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons name="bookmark-outline" size={24} color="#fff" />
            <Text style={styles.additionalText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
            <Text style={styles.additionalText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
            <Text style={styles.additionalText}>Like</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100,
    justifyContent: "space-between",
  },
  articleInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  source: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  category: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 32,
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 30,
  },
  visualizerContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  visualizer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  wave: {
    width: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  timeText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    marginHorizontal: 15,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  controlButton: {
    padding: 15,
    marginHorizontal: 20,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  loadingButton: {
    opacity: 0.7,
  },
  speedContainer: {
    marginVertical: 20,
  },
  speedLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  speedButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  speedButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  activeSpeedButton: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  speedText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  activeSpeedText: {
    color: "#fff",
    fontWeight: "600",
  },
  voiceContainer: {
    marginVertical: 20,
  },
  voiceLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  voiceButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  voiceButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  activeVoiceButton: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  voiceText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  activeVoiceText: {
    color: "#fff",
    fontWeight: "600",
  },
  additionalControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  additionalButton: {
    alignItems: "center",
    padding: 10,
  },
  additionalText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
});

export default AudioMode;
