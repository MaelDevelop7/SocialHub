import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  // Couleurs dynamiques selon le mode
  const backgroundColor = darkMode ? "#222" : "#fff";
  const textColor = darkMode ? "#fff" : "#000";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: textColor }]}>Settings</Text>

      <View style={styles.option}>
        <Text style={[styles.label, { color: textColor }]}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={(value) => setDarkMode(value)}
        />
      </View>

      <View style={styles.option}>
        <Text style={[styles.label, { color: textColor }]}>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={(value) => setNotifications(value)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 18,
  },
});
