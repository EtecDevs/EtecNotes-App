"use client"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Jornal")

  const tabs = ["Jornal", "Patch", "Eventos"]

  const tabContent = {
    Jornal: {
      title: "Semana Tecnológica",
      content: (
        <View>
          <View style={styles.journalImageContainer}>
            <View style={styles.journalImagePlaceholder}>
              <Ionicons name="newspaper" size={48} color="#8B5CF6" />
            </View>
          </View>
          <Text style={styles.journalDescription}>
            O Jornal Etec é um periódico voltado para a divulgação de notícias, eventos e atividades da Etec (Escola
            Técnica Estadual). Seu objetivo é manter alunos, professores e a comunidade escolar atualizados sobre o que
            acontece dentro da instituição, além de abordar temas relevantes para o ambiente educacional. O jornal traz
            reportagens, entrevistas e informações sobre cursos, projetos, eventos e muito mais.
          </Text>
        </View>
      ),
    },
    Patch: {
      title: "Patch Notes",
      content: (
        <View style={styles.patchNotesContainer}>
          <View style={styles.patchNoteCard}>
            <Text style={styles.patchVersion}>Versão 1.2.0 - Abril 2025</Text>
            <Text style={styles.patchItem}>• Novo layout para a aba de Eventos.</Text>
            <Text style={styles.patchItem}>• Animação adicionada nos ícones da Tab Bar.</Text>
            <Text style={styles.patchItem}>• Correções de bugs menores e melhorias de desempenho.</Text>
          </View>

          <View style={styles.patchNoteCard}>
            <Text style={styles.patchVersion}>Versão 1.1.0 - Março 2025</Text>
            <Text style={styles.patchItem}>• Tela de Chat adicionada.</Text>
            <Text style={styles.patchItem}>• Integração com o sistema de IAT.</Text>
          </View>

          <View style={styles.patchNoteCard}>
            <Text style={styles.patchVersion}>Versão 1.0.0 - Fevereiro 2025</Text>
            <Text style={styles.patchItem}>• Lançamento inicial do app!</Text>
          </View>
        </View>
      ),
    },
    Eventos: {
      title: "Eventos",
      content: (
        <View style={styles.eventsContainer}>
          <View style={styles.eventCard}>
            <View style={styles.eventImageContainer}>
              <View style={styles.eventImagePlaceholder}>
                <Ionicons name="school" size={32} color="#8B5CF6" />
              </View>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Semana Tecnológica</Text>
              <Text style={styles.eventDate}>10 a 14 de Abril de 2025</Text>
              <Text style={styles.eventDescription}>Workshops, palestras e desafios para os alunos da Etec.</Text>
            </View>
          </View>

          <View style={styles.eventCard}>
            <View style={styles.eventImageContainer}>
              <View style={styles.eventImagePlaceholder}>
                <Ionicons name="briefcase" size={32} color="#8B5CF6" />
              </View>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Feira de Profissões</Text>
              <Text style={styles.eventDate}>Em breve</Text>
              <Text style={styles.eventDescription}>
                Conheça as diferentes áreas profissionais e oportunidades de carreira.
              </Text>
            </View>
          </View>
        </View>
      ),
    },
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Início</Text>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabContentContainer}>
          <Text style={styles.contentTitle}>{tabContent[activeTab].title}</Text>
          {tabContent[activeTab].content}
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#EDE9FE",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#8B5CF6",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  tabContentContainer: {
    padding: 24,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B5CF6",
    marginBottom: 24,
  },
  journalImageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  journalImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  journalDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
    textAlign: "justify",
  },
  patchNotesContainer: {
    gap: 16,
  },
  patchNoteCard: {
    backgroundColor: "#EDE9FE",
    borderRadius: 16,
    padding: 20,
  },
  patchVersion: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  patchItem: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
    lineHeight: 22,
  },
  eventsContainer: {
    gap: 20,
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  eventImagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  eventContent: {
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  eventDate: {
    fontSize: 16,
    color: "#8B5CF6",
    marginBottom: 12,
    fontWeight: "500",
  },
  eventDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
})
