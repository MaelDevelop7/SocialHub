import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export type Note = {
  id: string;
  title: string;
  content: string;
};

type Props = {
  onAddNote: (note: Note) => void;
  onCancel: () => void;
  existingNote?: Note;
};

export default function NewNotePage({ onAddNote, onCancel, existingNote }: Props) {
  const [title, setTitle] = useState(existingNote?.title || "");
  const [content, setContent] = useState(existingNote?.content || "");

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in the note title and content.");
      return;
    }

    const newNote: Note = {
      id: existingNote?.id || Date.now().toString(),
      title,
      content,
    };

    onAddNote(newNote);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{existingNote ? "Edit Note" : "New Note"}</Text>

      <TextInput
        style={styles.inputTitle}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.inputContent}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  inputTitle: { fontSize: 18, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
  inputContent: { fontSize: 16, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, height: 150, textAlignVertical: "top", marginBottom: 20 },
  buttons: { flexDirection: "row", justifyContent: "space-between" },
  button: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 8, flex: 1, marginRight: 10, alignItems: "center" },
  cancelButton: { backgroundColor: "#f44336", marginRight: 0, marginLeft: 10 },
  buttonText: { color: "#fff", fontSize: 16 },
});
