import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const tabIcons = {
    Home: "home",
    Search: "search",
    Saved: "bookmark",
    History: "time",
    Profile: "person",
  };

  const tabLabels = {
    Home: "Home",
    Search: "Search",
    Saved: "Saved",
    History: "History",
    Profile: "Profile",
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      />
      <View style={styles.tabContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = tabLabels[route.name as keyof typeof tabLabels];
          const iconName = tabIcons[route.name as keyof typeof tabIcons];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tab}
            >
              <View style={[styles.tabContent, isFocused && styles.activeTab]}>
                <Ionicons
                  name={isFocused ? `${iconName}` : `${iconName}-outline`}
                  size={24}
                  color={isFocused ? "#fff" : "rgba(255,255,255,0.6)"}
                />
                <Text
                  style={[styles.tabLabel, isFocused && styles.activeTabLabel]}
                >
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabContainer: {
    flexDirection: "row",
    height: 60,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 60,
  },
  activeTab: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tabLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  activeTabLabel: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default TabBar;
