"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

// Importar imagens dos eventos
const semanaTecnologica = require("../assets/events/semana-tecnologica.jpg")
const hackathon = require("../assets/events/hackathon.png")
const palestra = require("../assets/events/palestra-ti.jpg")
const festaJunina = require("../assets/events/festa-junina.jpg")

const { width } = Dimensions.get("window")
const TABS = ["Jornal", "Horários", "Patch", "Eventos"] // Added "Horários"
const INITIAL_TAB = 0 // Jornal como tab inicial após login

// Componente de Jornal com carrossel de slides
const JournalTab = ({ theme, scrollEnabled }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "Semana Tecnológica",
      description: "A Semana Tecnológica da Etec é um evento anual que reúne palestras, workshops e exposições sobre as últimas tendências em tecnologia. Os alunos têm a oportunidade de conhecer profissionais da área, participar de competições e apresentar seus projetos inovadores para a comunidade.",
      image: semanaTecnologica,
      color: "#6B32C3",
      icon: "school-outline"
    },
    {
      id: 2,
      title: "Hackathon Etec",
      description: "O Hackathon da Etec é uma maratona de programação onde alunos formam equipes para desenvolver soluções tecnológicas inovadoras em 24 horas. É uma oportunidade única de colocar em prática os conhecimentos adquiridos e competir com colegas em um ambiente colaborativo e desafiador.",
      image: hackathon,
      color: "#5527A3",
      icon: "code-slash-outline"
    },
    {
      id: 3,
      title: "Palestras em TI",
      description: "Conheça as palestras e workshops ministrados por profissionais renomados da área de tecnologia. São oportunidades de aprendizado sobre carreira, novas tecnologias, metodologias ágeis e tendências do mercado de trabalho.",
      image: palestra,
      color: "#7B3FD7",
      icon: "bulb-outline"
    },
    {
      id: 4,
      title: "Eventos Culturais",
      description: "A Etec oferece diversos eventos culturais ao longo do ano, como festa junina, gincanas, apresentações artísticas e confraternizações. Esses eventos promovem a integração entre alunos, professores e a comunidade escolar.",
      image: festaJunina,
      color: "#9352EB",
      icon: "balloon-outline"
    }
  ]

  const currentSlideData = slides[currentSlide]

  const goToPreviousSlide = () => {
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  const goToNextSlide = () => {
    setCurrentSlide((currentSlide + 1) % slides.length)
  }

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide])

  return (
    <ScrollView style={styles.tabContent} scrollEnabled={scrollEnabled}>
      <Text style={[styles.contentTitle, { color: theme.colors.primary }]}>
        Jornal Etec
      </Text>

      {/* Slider Card com Imagem */}
      <View style={[styles.journalSliderCard, { backgroundColor: currentSlideData.color }]}>
        <Image 
          source={currentSlideData.image} 
          style={styles.journalImage}
          resizeMode="cover"
        />
        <View style={styles.journalImageOverlay} />

        {/* Navigation Buttons */}
        <TouchableOpacity
          onPress={goToPreviousSlide}
          style={[styles.journalNavButton, styles.journalNavButtonLeft]}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNextSlide}
          style={[styles.journalNavButton, styles.journalNavButtonRight]}
        >
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Slide Indicators */}
      <View style={styles.journalIndicators}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentSlide(index)}
            style={[
              styles.journalIndicator,
              {
                backgroundColor: index === currentSlide ? theme.colors.primary : theme.colors.textSecondary,
                width: index === currentSlide ? 32 : 8,
                opacity: index === currentSlide ? 1 : 0.3,
              },
            ]}
          />
        ))}
      </View>

      {/* Description */}
      <View style={[styles.journalDescription, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.journalTitle, { color: theme.colors.text }]}>
          {currentSlideData.title}
        </Text>
        <Text style={[styles.journalText, { color: theme.colors.textSecondary }]}>
          {currentSlideData.description}
        </Text>
      </View>

      {/* Info Section */}
      <View style={[styles.journalInfoCard, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="information-circle" size={32} color={theme.colors.primary} />
        <Text style={[styles.journalInfoText, { color: theme.colors.text }]}>
          O Jornal Etec mantém alunos, professores e a comunidade escolar atualizados sobre eventos, 
          atividades e temas relevantes para o ambiente educacional.
        </Text>
      </View>

      {/* Espaçamento extra no final para garantir visibilidade */}
      <View style={{ height: 120 }} />
    </ScrollView>
  )
}

// Componente de Horários com navegação por setas
const ScheduleTab = ({ theme, scrollEnabled }) => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0)

  const scheduleData = [
    {
      day: "Segunda",
      classes: [
        { time: "08:00 - 08:50", subject: "Aula Vaga", isVacant: true },
        { time: "08:50 - 09:40", subject: "Aula Vaga", isVacant: true },
        { time: "09:40 - 10:00", subject: "Intervalo", isBreak: true },
        { time: "10:00 - 10:50", subject: "Sistemas Embarcados", teacher: "Prof. Iury" },
        { time: "10:50 - 11:40", subject: "Sistemas Embarcados", teacher: "Prof. Iury" },
        { time: "11:40 - 12:30", subject: "Sociologia", teacher: "Profa. Elza" },
        { time: "12:30 - 13:30", subject: "Almoço", isBreak: true },
        { time: "13:30 - 14:20", subject: "EAMT", teacher: "Profa. Elza" },
        { time: "14:20 - 15:10", subject: "EAMT", teacher: "Profa. Elza" },
        { time: "15:10 - 16:00", subject: "EAMT", teacher: "Profa. Elza" },
      ],
    },
    {
      day: "Terça",
      classes: [
        { time: "08:00 - 08:50", subject: "P.W.", teacher: "Prof. Paulo" },
        { time: "08:50 - 09:40", subject: "P.W.", teacher: "Prof. Paulo" },
        { time: "09:40 - 10:00", subject: "Intervalo", isBreak: true },
        { time: "10:00 - 10:50", subject: "E.A.C.N.T.", teacher: "Profa. Elza e Profa. Andreia" },
        { time: "10:50 - 11:40", subject: "E.A.C.N.T.", teacher: "Profa. Elza e Profa. Andreia" },
        { time: "11:40 - 12:30", subject: "Inglês", teacher: "Prof. Fidélis" },
        { time: "12:30 - 13:30", subject: "Almoço", isBreak: true },
        { time: "13:30 - 14:20", subject: "Inglês", teacher: "Prof. Fidélis" },
        { time: "14:20 - 15:10", subject: "Matematica", teacher: "Prof. William B." },
        { time: "15:10 - 16:00", subject: "Matematica", teacher: "Prof. William B." },
      ],
    },
    {
      day: "Quarta",
      classes: [
        { time: "08:00 - 08:50", subject: "P.A.M. I, II", teacher: "Prof. Paulo" },
        { time: "08:50 - 09:40", subject: "P.A.M. I, II", teacher: "Prof. Paulo" },
        { time: "09:40 - 10:00", subject: "Intervalo", isBreak: true },
        { time: "10:00 - 10:50", subject: "IPSSI", teacher: "Prof. Iury e Profa. Vanessa" },
        { time: "10:50 - 11:40", subject: "IPSSI", teacher: "Prof. Iury e Profa. Vanessa" },
        { time: "11:40 - 12:30", subject: "Filosofia", teacher: "Profa. Elza" },
        { time: "12:30 - 13:30", subject: "Almoço", isBreak: true },
        { time: "13:30 - 14:20", subject: "Biologia", teacher: "Profa. Andreia" },
        { time: "14:20 - 15:10", subject: "Biologia", teacher: "Profa. Andreia" },
        { time: "15:10 - 16:00", subject: "E.A.C.N.T.", teacher: "Profa. Andreia e Profa. Elza" },
      ],
    },
    {
      day: "Quinta",
      classes: [
        { time: "08:00 - 08:50", subject: "Português", teacher: "Prof. Fidélis" },
        { time: "08:50 - 09:40", subject: "Português", teacher: "Prof. Fidélis" },
        { time: "09:40 - 10:00", subject: "Intervalo", isBreak: true },
        { time: "10:00 - 10:50", subject: "P.D.T.C.C.", teacher: "Profa. Veridiane e Profa. Elisângela" },
        { time: "10:50 - 11:40", subject: "P.D.T.C.C.", teacher: "Profa. Veridiane e Profa. Elisângela" },
        { time: "11:40 - 12:30", subject: "P.D.T.C.C.", teacher: "Profa. Veridiane e Profa. Elisângela" },
        { time: "12:30 - 13:30", subject: "Almoço", isBreak: true },
        { time: "13:30 - 14:20", subject: "Português", teacher: "Prof. Fidélis" },
        { time: "14:20 - 15:10", subject: "Matematica", teacher: "Prof. William B." },
        { time: "15:10 - 16:00", subject: "Matematica", teacher: "Prof. William B." },
      ],
    },
    {
      day: "Sexta",
      classes: [
        { time: "08:00 - 08:50", subject: "Aula Vaga", isVacant: true },
        { time: "08:50 - 09:40", subject: "Filosofia", teacher: "Profa. Elza" },
        { time: "09:40 - 10:00", subject: "Intervalo", isBreak: true },
        { time: "10:00 - 10:50", subject: "Q.T.S.", teacher: "Prof. Iury e Prof. Gisbert" },
        { time: "10:50 - 11:40", subject: "Q.T.S.", teacher: "Prof. Iury e Prof. Gisbert" },
        { time: "11:40 - 12:30", subject: "Aula Vaga", isVacant: true },
        { time: "12:30 - 13:30", subject: "Almoço", isBreak: true },
        { time: "13:30 - 14:20", subject: "Geografia", teacher: "Prof. Valdeci" },
        { time: "14:20 - 15:10", subject: "Geografia", teacher: "Prof. Valdeci" },
        { time: "15:10 - 16:00", subject: "Sociologia", teacher: "Profa. Elza" },
      ],
    },
  ]

  const currentSchedule = scheduleData[currentDayIndex]

  const goToPreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1)
    }
  }

  const goToNextDay = () => {
    if (currentDayIndex < scheduleData.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1)
    }
  }

  return (
    <View style={styles.tabContent}>
      <Text style={[styles.contentTitle, { color: theme.colors.primary }]}>
        Horários da Semana
      </Text>

      {/* Navigation Header */}
      <View style={styles.scheduleNavigation}>
        <TouchableOpacity
          onPress={goToPreviousDay}
          disabled={currentDayIndex === 0}
          style={[
            styles.navButton,
            { backgroundColor: theme.colors.primary },
            currentDayIndex === 0 && styles.navButtonDisabled,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentDayIndex === 0 ? theme.colors.textSecondary : "#FFFFFF"}
          />
        </TouchableOpacity>

        <View style={[styles.dayIndicator, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.dayIndicatorText, { color: theme.colors.primary }]}>
            {currentSchedule.day}
          </Text>
        </View>

        <TouchableOpacity
          onPress={goToNextDay}
          disabled={currentDayIndex === scheduleData.length - 1}
          style={[
            styles.navButton,
            { backgroundColor: theme.colors.primary },
            currentDayIndex === scheduleData.length - 1 && styles.navButtonDisabled,
          ]}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentDayIndex === scheduleData.length - 1 ? theme.colors.textSecondary : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>

      {/* Day Indicators */}
      <View style={styles.dayDots}>
        {scheduleData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentDayIndex ? theme.colors.primary : theme.colors.textSecondary,
                opacity: index === currentDayIndex ? 1 : 0.3,
              },
            ]}
          />
        ))}
      </View>

      {/* Schedule Content */}
      <ScrollView 
        style={styles.scheduleContent} 
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        <View style={[styles.dayCardSingle, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.classBlock}>
            {currentSchedule.classes.map((classItem, index) => {
              if (classItem.isBreak) {
                return (
                  <View
                    key={index}
                    style={[styles.breakItem, { backgroundColor: theme.colors.primary + "20" }]}
                  >
                    <Text style={[styles.breakText, { color: theme.colors.primary }]}>
                      {classItem.subject} ({classItem.time})
                    </Text>
                  </View>
                )
              }

              if (classItem.isVacant) {
                return (
                  <View
                    key={index}
                    style={[styles.vacantItem, { backgroundColor: theme.colors.primary }]}
                  >
                    <Text style={styles.vacantText}>{classItem.subject}</Text>
                    <Text style={styles.vacantTime}>{classItem.time}</Text>
                  </View>
                )
              }

              return (
                <ClassItem
                  key={index}
                  time={classItem.time}
                  subject={classItem.subject}
                  teacher={classItem.teacher}
                  theme={theme}
                />
              )
            })}
          </View>
        </View>

        {/* Espaçamento extra no final para garantir visibilidade */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  )
}

export default function HomeScreen() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState(INITIAL_TAB)
  const [scrollEnabled, setScrollEnabled] = useState(true) // Controla se o scroll vertical está habilitado
  const scrollX = useRef(new Animated.Value(-width * INITIAL_TAB)).current
  const scrollViewRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const isHorizontalSwipe = useRef(null) // null = não determinado ainda

  // Controlador de gestos otimizado com bloqueio de scroll vertical
  const handleTouchStart = (event) => {
    isDragging.current = true
    isHorizontalSwipe.current = null // Reseta ao começar novo toque
    startX.current = event.nativeEvent.pageX
    startY.current = event.nativeEvent.pageY
  }

  const handleTouchMove = (event) => {
    if (!isDragging.current) return

    const currentX = event.nativeEvent.pageX
    const currentY = event.nativeEvent.pageY
    const diffX = currentX - startX.current
    const diffY = currentY - startY.current

    // Determina a direção apenas uma vez
    if (isHorizontalSwipe.current === null) {
      const absX = Math.abs(diffX)
      const absY = Math.abs(diffY)
      
      // Se moveu mais de 10px, determina a direção
      if (absX > 10 || absY > 10) {
        isHorizontalSwipe.current = absX > absY
        
        // Se for horizontal, BLOQUEIA o scroll vertical
        if (isHorizontalSwipe.current) {
          setScrollEnabled(false)
        }
      } else {
        return
      }
    }

    // Só aplica o movimento horizontal se for swipe horizontal
    if (isHorizontalSwipe.current === true) {
      const newPosition = -width * activeTab + diffX

      // Limita o scroll nas extremidades
      if (
        (activeTab === 0 && diffX > 0) || 
        (activeTab === TABS.length - 1 && diffX < 0)
      ) {
        return
      }

      scrollX.setValue(newPosition)
    }
  }

  const handleTouchEnd = (event) => {
    if (!isDragging.current) return
    
    const wasHorizontalSwipe = isHorizontalSwipe.current === true
    isDragging.current = false
    isHorizontalSwipe.current = null
    
    // REABILITA o scroll vertical ao soltar o dedo
    setScrollEnabled(true)

    // Só troca de tab se foi um swipe horizontal
    if (wasHorizontalSwipe) {
      const currentX = event.nativeEvent.pageX
      const diff = currentX - startX.current
      const moveThreshold = width * 0.2

      let newIndex = activeTab
      if (Math.abs(diff) > moveThreshold) {
        newIndex = diff > 0 ? Math.max(0, activeTab - 1) : Math.min(TABS.length - 1, activeTab + 1)
      }

      switchTab(newIndex)
    } else {
      // Se não foi swipe horizontal, mantém a posição atual
      switchTab(activeTab)
    }
  }

  const switchTab = (index) => {
    setActiveTab(index)
    Animated.spring(scrollX, {
      toValue: -width * index,
      tension: 68,
      friction: 12,
      useNativeDriver: true,
    }).start()
  }

  const renderContent = (tab) => {
    switch (tab) {
      case "Jornal":
        return <JournalTab theme={theme} scrollEnabled={scrollEnabled} />

      case "Horários":
        return <ScheduleTab theme={theme} scrollEnabled={scrollEnabled} />

      case "Patch":
        return (
          <ScrollView style={styles.tabContent} scrollEnabled={scrollEnabled}>
            <Text style={[styles.contentTitle, { color: theme.colors.primary }]}>
              Patch Notes
            </Text>

            <View style={styles.patchContainer}>
              {/* Feature Card */}
              <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.featureHeader}>
                  <Ionicons name="sparkles" size={32} color={theme.colors.primary} />
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                    Novas funcionalidades!
                  </Text>
                </View>
                <View style={[styles.featureImageContainer, { backgroundColor: theme.colors.surfaceSecondary }]}>
                  <Ionicons name="rocket-outline" size={64} color={theme.colors.primary} />
                </View>
                <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                  Estamos sempre melhorando o EtecNotes para você!
                </Text>
              </View>

              {/* Updates List */}
              <View style={styles.updatesList}>
                <Text style={[styles.updatesTitle, { color: theme.colors.text }]}>
                  Atualizações Recentes
                </Text>

                <View style={[styles.versionCard, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.versionHeader}>
                    <Text style={[styles.versionNumber, { color: theme.colors.primary }]}>v1.2.0</Text>
                    <Text style={[styles.versionDate, { color: theme.colors.textSecondary }]}>Outubro 2025</Text>
                  </View>
                  
                  <View style={styles.updateItem}>
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                    <Text style={[styles.updateText, { color: theme.colors.text }]}>
                      Novo estilo de personalização (Modo escuro)
                    </Text>
                  </View>
                  
                  <View style={styles.updateItem}>
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                    <Text style={[styles.updateText, { color: theme.colors.text }]}>
                      Redesign das Interfaces anteriores
                    </Text>
                  </View>

                  <View style={styles.updateItem}>
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                    <Text style={[styles.updateText, { color: theme.colors.text }]}>
                      Melhorias de performance e navegação
                    </Text>
                  </View>

                  <View style={styles.updateItem}>
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                    <Text style={[styles.updateText, { color: theme.colors.text }]}>
                      Nova aba de horários integrada
                    </Text>
                  </View>
                </View>

                <View style={[styles.versionCard, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.versionHeader}>
                    <Text style={[styles.versionNumber, { color: theme.colors.primary }]}>v1.1.0</Text>
                    <Text style={[styles.versionDate, { color: theme.colors.textSecondary }]}>Setembro 2025</Text>
                  </View>
                  
                  <View style={styles.updateItem}>
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                    <Text style={[styles.updateText, { color: theme.colors.text }]}>
                      Sistema de autenticação implementado
                    </Text>
                  </View>
                  
                  <View style={styles.updateItem}>
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                    <Text style={[styles.updateText, { color: theme.colors.text }]}>
                      Correção de bugs na tela de notas
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Espaçamento extra no final para garantir visibilidade */}
            <View style={{ height: 120 }} />
          </ScrollView>
        )

      case "Eventos":
        return (
          <ScrollView style={styles.tabContent} scrollEnabled={scrollEnabled}>
            <Text style={[styles.contentTitle, { color: theme.colors.primary }]}>
              Eventos
            </Text>

            <View style={styles.eventsContainer}>
              {[
                {
                  id: 1,
                  title: "Semana Tecnológica",
                  date: "15 de Setembro de 2025",
                  time: "14:00",
                  description: "Exposição de projetos tecnológicos desenvolvidos pelos alunos da Etec com demonstrações práticas.",
                  location: "Auditório Principal",
                  icon: "school",
                  isPaid: false,
                },
                {
                  id: 2,
                  title: "Hopi-Hari",
                  date: "28 de Setembro de 2025",
                  time: "19:00",
                  description: "Passeio especial ao parque de diversões Hopi-Hari com toda a turma.",
                  location: "Parque Hopi-Hari",
                  icon: "happy",
                  isPaid: true,
                  price: 200,
                },
                {
                  id: 3,
                  title: "Festa Junina",
                  date: "5 de Outubro de 2025",
                  time: "13:30",
                  description: "Grande festa junina com comidas típicas, jogos e apresentações culturais.",
                  location: "Quadra Poliesportiva",
                  icon: "bonfire",
                  isPaid: true,
                  price: 10,
                },
                {
                  id: 4,
                  title: "Hackathon Etec 2025",
                  date: "19 de Outubro de 2025",
                  time: "18:00",
                  description: "Maratona de programação de 24 horas com premiação e oportunidades de estágio.",
                  location: "Laboratórios de Informática",
                  icon: "code-slash",
                  isPaid: false,
                },
              ].map((event) => (
                <View key={event.id} style={[styles.eventCardItem, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.eventCardHeader}>
                    <View style={[styles.eventIconContainer, { backgroundColor: theme.colors.surfaceSecondary }]}>
                      <Ionicons name={event.icon} size={32} color={theme.colors.primary} />
                    </View>
                    <View style={styles.eventHeaderText}>
                      <Text style={[styles.eventCardTitle, { color: theme.colors.text }]}>
                        {event.title}
                      </Text>
                      {event.isPaid && (
                        <View style={[styles.priceBadge, { backgroundColor: theme.colors.primary }]}>
                          <Text style={styles.priceText}>R$ {event.price.toFixed(2)}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <Text style={[styles.eventCardDescription, { color: theme.colors.textSecondary }]}>
                    {event.description}
                  </Text>

                  <View style={styles.eventDetailsContainer}>
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="calendar" size={16} color={theme.colors.primary} />
                      <Text style={[styles.eventDetailText, { color: theme.colors.text }]}>
                        {event.date}
                      </Text>
                    </View>
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="time" size={16} color={theme.colors.primary} />
                      <Text style={[styles.eventDetailText, { color: theme.colors.text }]}>
                        {event.time}
                      </Text>
                    </View>
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="location" size={16} color={theme.colors.primary} />
                      <Text style={[styles.eventDetailText, { color: theme.colors.text }]}>
                        {event.location}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={[styles.eventButton, { backgroundColor: theme.colors.primary }]}
                  >
                    <Text style={styles.eventButtonText}>
                      {event.isPaid ? "Inscrever-se" : "Marcar Presença"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Espaçamento extra no final para garantir visibilidade */}
            <View style={{ height: 120 }} />
          </ScrollView>
        )
    }
  }

  // Modifica o estilo dos títulos e adiciona navegação por tabs
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Início</Text>
      </View>

      {/* Tabs de navegação */}
      <View style={[styles.tabsContainer, { backgroundColor: theme.colors.surface }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => switchTab(TABS.indexOf(tab))}
            style={[
              styles.tab,
              { 
                backgroundColor: activeTab === TABS.indexOf(tab) 
                  ? `${theme.colors.primary}20`
                  : 'transparent'
              }
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { 
                  color: activeTab === TABS.indexOf(tab) 
                    ? theme.colors.primary 
                    : theme.colors.textSecondary,
                  fontWeight: activeTab === TABS.indexOf(tab) ? '600' : '500'
                }
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo deslizante */}
      <Animated.View
        style={[styles.scrollContainer, { transform: [{ translateX: scrollX }] }]}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {TABS.map((tab) => (
          <View key={tab} style={styles.page}>
            {renderContent(tab)}
          </View>
        ))}
      </Animated.View>
    </View>
  )
}

// Component for individual class items
const ClassItem = ({ time, subject, teacher, theme }) => (
  <View style={[styles.classItem, { backgroundColor: theme.colors.surfaceSecondary }]}>
    <View style={styles.classHeader}>
      <Text style={[styles.classSubject, { color: theme.colors.text }]}>{subject}</Text>
      <Text style={[styles.classTime, { color: theme.colors.textSecondary }]}>{time}</Text>
    </View>
    <Text style={[styles.classTeacher, { color: theme.colors.textSecondary }]}>{teacher}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s',
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'row',
    width: width * TABS.length,
  },
  page: {
    width: width,
    overflow: 'hidden',
  },
  tabContent: {
    flex: 1,
    padding: 24,
    paddingBottom: 100,
  },
  journalImageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  journalImagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  patchNotesContainer: {
    marginTop: 16,
  },
  patchNoteCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  patchVersion: {
    fontSize: 14,
    fontWeight: "bold",
  },
  patchItem: {
    fontSize: 14,
    lineHeight: 22,
  },
  eventsContainer: {
    marginTop: 16,
  },
  eventCard: {
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
  },
  contentTitle: {
    fontSize: 32, // Aumentado de 28 para 32
    fontWeight: "800", // Mais bold
    marginBottom: 24,
    textAlign: 'center', // Centralizado
    paddingHorizontal: 24,
  },
  scheduleNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  dayIndicator: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayIndicatorText: {
    fontSize: 20,
    fontWeight: "700",
  },
  dayDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scheduleContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dayCardSingle: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  vacantItem: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  vacantText: {
    fontSize: 14,
    fontWeight: "600",
    color: '#FFFFFF',
    marginBottom: 4,
  },
  vacantTime: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  classBlock: {
    gap: 8,
  },
  classItem: {
    padding: 12,
    borderRadius: 8,
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  classSubject: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  classTime: {
    fontSize: 12,
    fontWeight: "500",
  },
  classTeacher: {
    fontSize: 12,
  },
  breakItem: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  breakText: {
    fontSize: 12,
    fontWeight: "500",
  },
  patchContainer: {
    marginTop: 16,
  },
  featureCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  featureImageContainer: {
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  updatesList: {
    gap: 16,
  },
  updatesTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  versionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  versionNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  versionDate: {
    fontSize: 12,
    fontWeight: "500",
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 4,
  },
  updateText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
  },
  eventCardItem: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventHeaderText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  eventCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  priceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: "700",
  },
  eventCardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  eventDetailsContainer: {
    marginBottom: 16,
    gap: 8,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    fontWeight: "500",
  },
  eventButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  eventButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "700",
  },
  journalSliderCard: {
    height: 280,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  journalImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  journalImageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 24,
  },
  journalIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalNavButton: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  journalNavButtonLeft: {
    left: 12,
    transform: [{ translateY: -20 }],
  },
  journalNavButtonRight: {
    right: 12,
    transform: [{ translateY: -20 }],
  },
  journalIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  journalIndicator: {
    height: 8,
    borderRadius: 4,
  },
  journalDescription: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  journalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  journalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  journalInfoCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  journalInfoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
})