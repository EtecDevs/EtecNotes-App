"use client"

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function WellnessScreen() {
  const wellnessOptions = [
    {
      id: 1,
      title: "Vídeos",
      icon: "play",
      color: "#8B5CF6",
      description: "Vídeos relaxantes e motivacionais",
    },
    {
      id: 2,
      title: "Músicas",
      icon: "musical-notes",
      color: "#8B5CF6",
      description: "Playlist para concentração e relaxamento",
    },
    {
      id: 3,
      title: "Jogos",
      icon: "game-controller",
      color: "#8B5CF6",
      description: "Jogos educativos e de relaxamento",
    },
  ]

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>IATEC</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="restaurant" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.headerButtonActive]}>
            <Ionicons name="fitness" size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Wellness Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="fitness" size={48} color="#8B5CF6" />
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.wellnessTitle}>Bem-estar</Text>
          <Text style={styles.wellnessSubtitle}>Relaxe com vídeos, músicas e jogos!</Text>
        </View>

        {/* Wellness Options */}
        <View style={styles.optionsContainer}>
          {wellnessOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                <Ionicons name={option.icon} size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Coming Soon Message */}
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonText}>
            * Em breve: navegue por conteúdos relaxantes recomendados especialmente para você!
          </Text>
        </View>

        {/* Additional Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Ionicons name="heart" size={24} color="#8B5CF6" />
            <Text style={styles.featureTitle}>Mindfulness</Text>
            <Text style={styles.featureDescription}>Exercícios de respiração e meditação</Text>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="moon" size={24} color="#8B5CF6" />
            <Text style={styles.featureTitle}>Relaxamento</Text>
            <Text style={styles.featureDescription}>Sons da natureza para dormir melhor</Text>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="flash" size={24} color="#8B5CF6" />
            <Text style={styles.featureTitle}>Energia</Text>
            <Text style={styles.featureDescription}>Exercícios rápidos para revigorar</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonActive: {
    backgroundColor: "#EDE9FE",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  wellnessTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B5CF6",
    marginBottom: 8,
  },
  wellnessSubtitle: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 26,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  optionCard: {
    width: (width - 72) / 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  comingSoonContainer: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  comingSoonText: {
    fontSize: 14,
    color: "#92400E",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 16,
    flex: 1,
  },
})
