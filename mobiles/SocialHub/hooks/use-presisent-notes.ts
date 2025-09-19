// hooks/usePersistentNotes.ts
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "../app/types/Notes";

export default function usePersistentNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    (async () => {
      const savedNotes = await AsyncStorage.getItem("notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    })();
  }, []);

  const saveNote = async (note: Note) => {
    const updatedNotes = [note, ...notes.filter(n => n.id !== note.id)];
    setNotes(updatedNotes);
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const deleteNote = async (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return { notes, saveNote, deleteNote };
}
