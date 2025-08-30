"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width } = Dimensions.get("window")

export default function NotesScreen() {
  const [notes, setNotes] = useState([])
  const [newNoteText, setNewNoteText] = useState("")

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notas</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Add Note Input */}
        <View style={styles.addNoteContainer}>
          <TextInput
            style={styles.noteInput}
            placeholder="Digite uma nota..."
            placeholderTextColor="#9CA3AF"
            value={newNoteText}
            onChangeText={setNewNoteText}
            multiline
          />
          <TouchableOpacity
            style={[styles.addButton, newNoteText.trim() ? styles.addButtonActive : null]}
            onPress={addNote}
          >
            <Ionicons name={newNoteText.trim() ? "checkmark" : "add"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Notes List */}
        {notes.map((note) => (
          <View key={note.id} style={styles.noteCard}>
            <View style={styles.noteContent}>
              <View style={styles.noteBorder} />
              <Text style={styles.noteText}>{note.text}</Text>
            </View>
          </View>
        ))}

        {notes.length === 0 && !newNoteText && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Nenhuma nota ainda</Text>
            <Text style={styles.emptySubtitle}>Comece digitando sua primeira nota acima</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B5CF6",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: "#374151",
    minHeight: 56,
    maxHeight: 120,
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonActive: {
    backgroundColor: "#8B5CF6",
  },
  noteCard: {
    backgroundColor: "#FFFFFF",
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
    padding: 20,
  },
  noteBorder: {
    width: 4,
    backgroundColor: "#8B5CF6",
    borderRadius: 2,
    marginRight: 16,
  },
  noteText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
  },
})
