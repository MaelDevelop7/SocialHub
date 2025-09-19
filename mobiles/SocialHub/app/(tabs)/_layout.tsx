import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "./context/ThemeContext";

import HomeIcon from "../assets/icons/notes.svg";
import SettingsIcon from "../assets/icons/settings.svg";

export default function TabsLayout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={styles.container}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#6200ee",
            tabBarInactiveTintColor: "#999",
            tabBarStyle: {
              backgroundColor: "#fff",
              borderTopWidth: Platform.OS === "ios" ? 0 : 1,
              elevation: 5,
            },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Notes",
              tabBarIcon: ({ color, size }) => (
                <HomeIcon width={size} height={size} fill={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              tabBarIcon: ({ color, size }) => (
                <SettingsIcon width={size} height={size} fill={color} />
              ),
            }}
          />
        </Tabs>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
