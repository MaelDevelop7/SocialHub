// pages/NotesPage.tsx
import { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import NewNotePage, { Note } from "./NewNotes";
import usePersistentNotes from "../../hooks/use-presisent-notes";

export default function NotesPage() {
  const { notes, saveNote, deleteNote } = usePersistentNotes();
  const [showNewNote, setShowNewNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const handleSaveNote = (note: Note) => {
    saveNote(note);
    setShowNewNote(false);
    setEditingNote(undefined);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete", "Do you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteNote(id) },
    ]);
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(id)}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderNote = ({ item }: { item: Note }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity
        style={styles.noteCard}
        onPress={() => { setEditingNote(item); setShowNewNote(true); }}
      >
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.noteContent} numberOfLines={2}>{item.content}</Text>
      </TouchableOpacity>
    </Swipeable>  
  );

  if (showNewNote) {
    return (
      <NewNotePage
        onAddNote={handleSaveNote}
        onCancel={() => { setEditingNote(undefined); setShowNewNote(false); }}
        existingNote={editingNote}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Notes</Text>
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.floatingButton} onPress={() => setShowNewNote(true)}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  list: { paddingBottom: 20 },
  noteCard: { backgroundColor: "#f5f5f5", padding: 15, borderRadius: 10, marginBottom: 15 },
  noteTitle: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  noteContent: { fontSize: 14, color: "#555" },
  floatingButton: { position: "absolute", bottom: 30, right: 30, backgroundColor: "#4CAF50", width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", elevation: 5 },
  floatingButtonText: { color: "#fff", fontSize: 30, fontWeight: "bold" },
  deleteButton: { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 80, marginBottom: 15, borderRadius: 10 },
  deleteText: { color: 'white', fontWeight: 'bold' },
});
