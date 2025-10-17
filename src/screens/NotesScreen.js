"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "../context/ThemeContext"

const { width } = Dimensions.get("window")

export default function NotesScreen() {
  const [notes, setNotes] = useState([])
  const [newNoteText, setNewNoteText] = useState("")
  const { theme } = useTheme()

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem("etecnotes-notes")
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      }
    } catch (error) {
      console.error("Error loading notes:", error)
    }
  }

  const saveNotes = async (updatedNotes) => {
    try {
      await AsyncStorage.setItem("etecnotes-notes", JSON.stringify(updatedNotes))
      setNotes(updatedNotes)
    } catch (error) {
      console.error("Error saving notes:", error)
    }
  }

  const addNote = () => {
    if (!newNoteText.trim()) {
      return
    }

    const note = {
      id: Date.now(),
      text: newNoteText,
      createdAt: new Date().toISOString(),
    }

    const updatedNotes = [note, ...notes]
    saveNotes(updatedNotes)
    setNewNoteText("")
  }

  const deleteNote = (noteId) => {
    Alert.alert("Excluir Nota", "Tem certeza que deseja excluir esta nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          const updatedNotes = notes.filter((note) => note.id !== noteId)
          saveNotes(updatedNotes)
        },
      },
    ])
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>Notas</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Add Note Input */}
        <View style={styles.addNoteContainer}>
          <TextInput
            style={[
              styles.noteInput,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Digite uma nota..."
            placeholderTextColor={theme.colors.textSecondary}
            value={newNoteText}
            onChangeText={setNewNoteText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              newNoteText.trim() ? { backgroundColor: theme.colors.primary } : { backgroundColor: theme.colors.surfaceSecondary },
            ]}
            onPress={addNote}
          >
            <Ionicons name={newNoteText.trim() ? "checkmark" : "add"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Notes List */}
        {notes.map((note) => (
          <View key={note.id} style={[styles.noteCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.noteContent}>
              <View style={[styles.noteBorder, { backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.noteText, { color: theme.colors.text }]}>{note.text}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNote(note.id)}>
                <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {notes.length === 0 && !newNoteText && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={theme.colors.surfaceSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.textSecondary }]}>Nenhuma nota ainda</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>Comece digitando sua primeira nota acima</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F3F4F6",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    // backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    // color: "#8B5CF6",
  },
  content: {
    paddingHorizontal: 24,
  },
  addNoteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 12,
  },
  noteInput: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    minHeight: 56,
    maxHeight: 120,
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noteContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  noteBorder: {
    width: 4,
    borderRadius: 2,
    marginRight: 16,
  },
  noteText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
})
