import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

const { width } = Dimensions.get("window")

export default function ScheduleScreen() {
  const { theme } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(1) // Start with Tuesday

  const scheduleData = [
    {
      day: "Segunda",
      periods: [
        { time: "08:00 - 08:50", subject: "Aula Vaga", isVacant: true },
        { time: "08:50 - 09:40", subject: "Aula Vaga", isVacant: true },
        { time: "09:40 - 10:00", subject: "Intervalo", isBreak: true },
        { time: "10:00 - 10:50", subject: "Sistemas Embarcados", teacher: "Prof. Iury" },
        { time: "10:50 - 11:40", subject: "Sistemas Embarcados", teacher: "Prof. Iury" },
        { time: "11:40 - 12:30", subject: "Sociologia", teacher: "Prof. Elza" },
        { time: "12:30 - 13:30", subject: "Almoço", isBreak: true },
        { time: "13:30 - 14:20", subject: "EAMT", teacher: "Prof. Elza" },
        { time: "14:20 - 15:10", subject: "EAMT", teacher: "Prof. Elza" },
        { time: "15:10 - 16:00", subject: "EAMT", teacher: "Prof. Elza" },
      ],
    },
    {
      day: "Terça",
      periods: [
        { time: "08:00 - 08:50", subject: "P.W. I, II, III", teacher: "Prof. Paulo e William G." },
        { time: "08:50 - 09:40", subject: "Programação Web I, II e III", teacher: "Prof. Paulo e William G." },
        { time: "09:40 - 10:00", subject: "Intervalo", isBreak: true },
        { time: "10:00 - 10:50", subject: "E.A.C.N.T.", teacher: "Prof. Elza e Prof. Andreia" },
        { time: "10:50 - 11:40", subject: "E.A.C.N.T.", teacher: "Prof. Elza e Prof. Andreia" },
        { time: "11:40 - 12:30", subject: "Matematica", teacher: "Prof. Santos" },
        { time: "12:30 - 13:30", subject: "Almoço", isBreak: true },
        { time: "13:30 - 14:20", subject: "Inglês", teacher: "Prof. Fidélis" },
        { time: "14:20 - 15:10", subject: "Matematica", teacher: "Prof. William B." },
        { time: "15:10 - 16:00", subject: "Matematica", teacher: "Prof. William B." },
      ],
    },
    {
      day: "Quarta",
      periods: [
        { time: "08:00 - 08:50", subject: "P.A.M. I, II", teacher: "Prof. Paulo" },
        { time: "08:50 - 09:40", subject: "P.A.M. I, II", teacher: "Prof. Paulo" },
        { time: "09:40 - 10:00", subject: "Intervalo", isBreak: true },
        { time: "10:00 - 10:50", subject: "IPSSI", teacher: "Prof. Iury e Prof. Vanessa" },
        { time: "10:50 - 11:40", subject: "IPSSI", teacher: "Prof. Iury e Prof. Vanessa" },
        { time: "11:40 - 12:30", subject: "Filosofia", teacher: "Prof. Silva" },
        { time: "12:30 - 13:30", subject: "Almoço", isBreak: true },
        { time: "13:30 - 14:20", subject: "Biologia", teacher: "Prof. Andreia" },
        { time: "14:20 - 15:10", subject: "Biologia", teacher: "Prof. Andreia" },
        { time: "15:10 - 16:00", subject: "E.A.C.N.T.", teacher: "Prof. Andreia e Prof. Elza" },
      ],
    },
    {
      day: "Quinta",
      periods: [
        { time: "08:00 - 08:50", subject: "Português", teacher: "Prof. Fidélis" },
        { time: "08:50 - 09:40", subject: "Português", teacher: "Prof. Fidélis" },
        { time: "09:40 - 10:00", subject: "Intervalo", isBreak: true },
        { time: "10:00 - 10:50", subject: "P.D.T.C.C.", teacher: "Prof. Veridiane e Prof. Elisângela" },
        { time: "10:50 - 11:40", subject: "P.D.T.C.C.", teacher: "Prof. Veridiane e Prof. Elisângela" },
        { time: "11:40 - 12:30", subject: "P.D.T.C.C.", teacher: "Prof. Veridiane e Prof. Elisângela" },
        { time: "12:30 - 13:30", subject: "Almoço", isBreak: true },
        { time: "13:30 - 14:20", subject: "Português", teacher: "Prof. Fidélis" },
        { time: "14:20 - 15:10", subject: "Matematica", teacher: "Prof. William B." },
        { time: "15:10 - 16:00", subject: "Matematica", teacher: "Prof. William B." },
      ],
    },
    {
      day: "Sexta",
      periods: [
        { time: "08:00 - 08:50", subject: "Aula Vaga", isVacant: true },
        { time: "08:50 - 09:40", subject: "Filosofia", teacher: "Prof. Elza" },
        { time: "09:40 - 10:00", subject: "Intervalo", isBreak: true },
        { time: "10:00 - 10:50", subject: "Q.T.S.", teacher: "Prof. Iury e Prof. Gisbert" },
        { time: "10:50 - 11:40", subject: "Q.T.S.", teacher: "Prof. Iury e Prof. Gisbert" },
        { time: "11:40 - 12:30", subject: "Aula Vaga", isVacant: true },
        { time: "12:30 - 13:30", subject: "Almoço", isBreak: true },
        { time: "13:30 - 14:20", subject: "Geografia", teacher: "Prof. Valdeci" },
        { time: "14:20 - 15:10", subject: "Geografia", teacher: "Prof. Valdeci" },
        { time: "15:10 - 16:00", subject: "Sociologia", teacher: "Prof. Elza" },
      ],
    },
  ]

  // Descobre o índice do dia da semana atual (Segunda=0, Terça=1, ...)
  const today = new Date()
  const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
  const todayIndex = Math.max(0, scheduleData.findIndex((d) => d.day === weekDays[today.getDay()]))
  const [openAccordion, setOpenAccordion] = useState(todayIndex)

  useEffect(() => {
    setOpenAccordion(todayIndex)
  }, [todayIndex])

  const styles = createStyles(theme)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Horários</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Acordeons dos dias da semana */}
        <View style={styles.accordionContainer}>
          {scheduleData.map((dayData, index) => (
            <View key={index} style={styles.accordion}>
              <TouchableOpacity
                style={[
                  styles.accordionHeader,
                  openAccordion === index && styles.accordionHeaderActive,
                ]}
                onPress={() => setOpenAccordion(openAccordion === index ? null : index)}
              >
                <Text style={styles.dayName}>{dayData.day}</Text>
                <Ionicons
                  name={openAccordion === index ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.colors.primary}
                />
                {index === todayIndex && (
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayText}>Hoje</Text>
                  </View>
                )}
              </TouchableOpacity>
              {openAccordion === index && (
                <View style={styles.scheduleCard}>
                  {dayData.periods.map((period, pIndex) => (
                    <View
                      key={pIndex}
                      style={[
                        styles.periodCard,
                        period.isBreak && styles.breakCard,
                        period.isVacant && styles.vacantCard,
                      ]}
                    >
                      <View style={styles.periodTime}>
                        <Text
                          style={[
                            styles.timeText,
                            period.isBreak && styles.breakTimeText,
                            period.isVacant && styles.vacantTimeText,
                          ]}
                        >
                          {period.time}
                        </Text>
                      </View>
                      <View style={styles.periodContent}>
                        <Text
                          style={[
                            styles.subjectText,
                            period.isBreak && styles.breakSubjectText,
                            period.isVacant && styles.vacantSubjectText,
                          ]}
                        >
                          {period.subject}
                        </Text>
                        {period.teacher && <Text style={styles.teacherText}>{period.teacher}</Text>}
                      </View>
                      <View style={styles.periodIcon}>
                        <Ionicons
                          name={period.isBreak ? "cafe" : period.isVacant ? "time" : "school"}
                          size={20}
                          color={period.isBreak ? theme.colors.primary : period.isVacant ? "#FFC107" : theme.colors.info}
                        />
                      </View>
                    </View>
                  ))}
                  {/* Resumo do dia */}
                  <View style={styles.summary}>
                    <Text style={styles.summaryTitle}>Resumo do Dia</Text>
                    <View style={styles.summaryStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                          {dayData.periods.filter((p) => !p.isBreak && !p.isVacant).length}
                        </Text>
                        <Text style={styles.statLabel}>Aulas</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{dayData.periods.filter((p) => p.isBreak).length}</Text>
                        <Text style={styles.statLabel}>Intervalos</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{dayData.periods.filter((p) => p.isVacant).length}</Text>
                        <Text style={styles.statLabel}>Vagas</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    accordionContainer: {
      flexDirection: "column",
      gap: 12,
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    accordion: {
      marginBottom: 8,
    },
    accordionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginBottom: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 1,
    },
    accordionHeaderActive: {
      backgroundColor: theme.colors.primary + "20",
    },
    dayName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 4,
    },
    todayBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    todayText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
    scheduleCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    periodCard: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 8,
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.info,
    },
    breakCard: {
      backgroundColor: "#F3EFFF",
      borderLeftColor: theme.colors.primary,
    },
    vacantCard: {
      backgroundColor: "#FFF8E1",
      borderLeftColor: "#FFC107",
    },
    periodTime: {
      width: 80,
      marginRight: 12,
    },
    timeText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    breakTimeText: {
      color: theme.colors.primary,
    },
    vacantTimeText: {
      color: "#F57C00",
    },
    periodContent: {
      flex: 1,
    },
    subjectText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: 2,
    },
    breakSubjectText: {
      color: theme.colors.primary,
      textAlign: "center",
    },
    vacantSubjectText: {
      color: "#F57C00",
      textAlign: "center",
    },
    teacherText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    periodIcon: {
      marginLeft: 12,
    },
    summary: {
      marginHorizontal: 24,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 32,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
      textAlign: "center",
    },
    summaryStats: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  })
