import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NewsPreferences } from "../types";
import { MockDataService } from "../services/mockDataService";

const { width } = Dimensions.get("window");

interface PreferencesScreenProps {
  onComplete: (preferences: NewsPreferences) => void;
  initialPreferences?: NewsPreferences;
}

const PreferencesScreen: React.FC<PreferencesScreenProps> = ({
  onComplete,
  initialPreferences,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<NewsPreferences>({
    categories: initialPreferences?.categories || [],
    sources: initialPreferences?.sources || [],
    languages: initialPreferences?.languages || ["en"],
    countries: initialPreferences?.countries || ["us"],
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const steps = [
    {
      title: "Choose Your Interests",
      subtitle: "Select the topics you want to see in your news feed",
      type: "categories" as keyof NewsPreferences,
      options: MockDataService.getCategories(),
    },
    {
      title: "Pick Your Sources",
      subtitle: "Choose your preferred news sources",
      type: "sources" as keyof NewsPreferences,
      options: MockDataService.getSources(),
    },
    {
      title: "Language & Region",
      subtitle: "Set your language and country preferences",
      type: "languages" as keyof NewsPreferences,
      options: [
        "English",
        "Spanish",
        "French",
        "German",
        "Chinese",
        "Japanese",
      ],
    },
  ];

  const toggleSelection = (type: keyof NewsPreferences, value: string) => {
    setPreferences((prev) => {
      const currentArray = prev[type] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return {
        ...prev,
        [type]: newArray,
      };
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences);
    }
  };

  const currentStepData = steps[currentStep];
  const selectedCount = (preferences[currentStepData.type] as string[]).length;

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.stepIndicator}>
            {currentStep + 1} of {steps.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentStep + 1) / steps.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        <Animated.View
          style={[
            styles.stepContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>

          <ScrollView
            style={styles.optionsContainer}
            showsVerticalScrollIndicator={false}
          >
            {currentStepData.options.map((option, index) => {
              const isSelected = (
                preferences[currentStepData.type] as string[]
              ).includes(option);

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionItem,
                    isSelected && styles.selectedOption,
                  ]}
                  onPress={() => toggleSelection(currentStepData.type, option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              {selectedCount} {currentStepData.type} selected
            </Text>
          </View>
        </Animated.View>

        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Ionicons name="chevron-back" size={24} color="#667eea" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.skipButton} onPress={skipStep}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.nextButton,
                selectedCount === 0 && styles.disabledButton,
              ]}
              onPress={nextStep}
              disabled={selectedCount === 0}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === steps.length - 1 ? "Complete" : "Next"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
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
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  stepIndicator: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  stepContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 40,
  },
  optionsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "#fff",
  },
  optionText: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "600",
  },
  selectionInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  selectionText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 15,
  },
  skipButtonText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
  },
  disabledButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  nextButtonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 5,
  },
});

export default PreferencesScreen;
