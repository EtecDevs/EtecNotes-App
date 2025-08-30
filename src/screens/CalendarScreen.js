"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width } = Dimensions.get("window")

export default function CalendarScreen() {
  const { theme } = useTheme()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [events, setEvents] = useState([])

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem("etecnotes-events")
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents))
      }
    } catch (error) {
      console.error("Error loading events:", error)
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const days = []

    // Previous month days
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDay = new Date(year, month, 0 - (firstDayOfMonth - i - 1))
      days.push({ date: prevMonthDay, isCurrentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i)
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getDate() === day.getDate() &&
          eventDate.getMonth() === day.getMonth() &&
          eventDate.getFullYear() === day.getFullYear()
        )
      })

      days.push({
        date: day,
        isCurrentMonth: true,
        hasEvent: dayEvents.some((e) => e.type === "event"),
        hasReminder: dayEvents.some((e) => e.type === "reminder"),
        hasExam: dayEvents.some((e) => e.type === "exam"),
        hasNote: dayEvents.some((e) => e.type === "note"),
      })
    }

    return days
  }

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + direction)
    setCurrentMonth(newMonth)
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date) => {
    return (
      date.getDate() === selectedDay.getDate() &&
      date.getMonth() === selectedDay.getMonth() &&
      date.getFullYear() === selectedDay.getFullYear()
    )
  }

  const getSelectedDayEvents = () => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === selectedDay.getDate() &&
        eventDate.getMonth() === selectedDay.getMonth() &&
        eventDate.getFullYear() === selectedDay.getFullYear()
      )
    })
  }

  const days = getDaysInMonth(currentMonth)
  const selectedDayEvents = getSelectedDayEvents()
  const styles = createStyles(theme)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendário</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>

          <Text style={styles.monthYear}>
            {currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </Text>

          <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendar}>
          {/* Week days */}
          <View style={styles.weekDays}>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, index) => (
              <Text key={index} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar days */}
          <View style={styles.daysGrid}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !day.isCurrentMonth && styles.inactiveDay,
                  isToday(day.date) && styles.today,
                  isSelected(day.date) && styles.selected,
                ]}
                onPress={() => setSelectedDay(day.date)}
              >
                <Text
                  style={[
                    styles.dayText,
                    !day.isCurrentMonth && styles.inactiveDayText,
                    isToday(day.date) && styles.todayText,
                    isSelected(day.date) && styles.selectedText,
                  ]}
                >
                  {day.date.getDate()}
                </Text>

                {/* Event indicators */}
                <View style={styles.indicators}>
                  {day.hasEvent && <View style={[styles.indicator, { backgroundColor: "#00B2FF" }]} />}
                  {day.hasReminder && <View style={[styles.indicator, { backgroundColor: "#8C43FF" }]} />}
                  {day.hasExam && <View style={[styles.indicator, { backgroundColor: "#FF4D4D" }]} />}
                  {day.hasNote && <View style={[styles.indicator, { backgroundColor: "#4CAF50" }]} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Day Events */}
        <View style={styles.eventsSection}>
          <Text style={styles.eventsTitle}>
            {selectedDay.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>

          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Ionicons
                    name={
                      event.type === "event"
                        ? "calendar"
                        : event.type === "reminder"
                          ? "notifications"
                          : event.type === "exam"
                            ? "school"
                            : "document-text"
                    }
                    size={20}
                    color={
                      event.type === "event"
                        ? "#00B2FF"
                        : event.type === "reminder"
                          ? "#8C43FF"
                          : event.type === "exam"
                            ? "#FF4D4D"
                            : "#4CAF50"
                    }
                  />
                  <Text style={styles.eventTitle}>{event.title}</Text>
                </View>
                {event.time && <Text style={styles.eventTime}>{event.time}</Text>}
                {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}
              </View>
            ))
          ) : (
            <View style={styles.noEvents}>
              <Ionicons name="calendar-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.noEventsText}>Nenhum evento neste dia</Text>
            </View>
          )}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legenda</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#00B2FF" }]} />
              <Text style={styles.legendText}>Evento</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#8C43FF" }]} />
              <Text style={styles.legendText}>Lembrete</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#FF4D4D" }]} />
              <Text style={styles.legendText}>Prova</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#4CAF50" }]} />
              <Text style={styles.legendText}>Nota</Text>
            </View>
          </View>
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
    calendarHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    navButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    monthYear: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text,
      textTransform: "capitalize",
    },
    calendar: {
      marginHorizontal: 24,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
    },
    weekDays: {
      flexDirection: "row",
      marginBottom: 16,
    },
    weekDay: {
      flex: 1,
      textAlign: "center",
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
    daysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    dayCell: {
      width: (width - 80) / 7,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      borderRadius: 8,
      position: "relative",
    },
    dayText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    inactiveDay: {
      opacity: 0.3,
    },
    inactiveDayText: {
      color: theme.colors.textSecondary,
    },
    today: {
      backgroundColor: "#00B2FF",
    },
    todayText: {
      color: "white",
      fontWeight: "bold",
    },
    selected: {
      backgroundColor: theme.colors.primary,
    },
    selectedText: {
      color: "white",
      fontWeight: "bold",
    },
    indicators: {
      position: "absolute",
      bottom: 4,
      flexDirection: "row",
      gap: 2,
    },
    indicator: {
      width: 4,
      height: 4,
      borderRadius: 2,
    },
    eventsSection: {
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    eventsTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
      textTransform: "capitalize",
    },
    eventCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    eventHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      marginLeft: 12,
      flex: 1,
    },
    eventTime: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    eventDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    noEvents: {
      alignItems: "center",
      paddingVertical: 40,
    },
    noEventsText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 12,
    },
    legend: {
      paddingHorizontal: 24,
      marginBottom: 32,
    },
    legendTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    legendItems: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    legendIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    legendText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  })
