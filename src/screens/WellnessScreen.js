import { useState, useRef, useEffect } from "react"
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Animated,
  Alert,
  Platform
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../context/ThemeContext"

const { width, height } = Dimensions.get("window")

export default function WellnessScreen({ isEmbedded = false, onTabChange = null }) {
  const { theme } = useTheme()
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("meditation")
  
  // Estados para música
  const [currentMusic, setCurrentMusic] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [audioError, setAudioError] = useState(false)
  
  // Estados para jogos/exercícios
  const [currentGame, setCurrentGame] = useState(null)
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState('inhale')
  const [breathingCount, setBreathingCount] = useState(1)
  
  // Animações
  const breathingScale = useRef(new Animated.Value(0.8)).current
  const breathingOpacity = useRef(new Animated.Value(1)).current
  const particleAnimations = useRef([...Array(8)].map(() => new Animated.Value(0))).current
  
  // Refs
  const audioRef = useRef(null)
  const breathingInterval = useRef(null)

  const handleTabChange = (tab) => {
    if (tab === "meditation") {
      setActiveTab(tab)
    } else if (tab === "iatec") {
      // Se tiver callback de navegação (quando embedded no CloudScreen), usa ele
      if (onTabChange) {
        onTabChange("iatec")
      } else {
        // Senão, tenta navegar (quando é standalone)
        navigation.navigate("Chat")
      }
    }
  }

  // Dados das músicas
  const musicOptions = [
    {
      id: 1,
      name: "Chuva Suave",
      duration: "15 min",
      url: "https://example.com/rain-sounds.mp3"
    },
    {
      id: 2,
      name: "Ondas do Mar", 
      duration: "20 min",
      url: "https://example.com/ocean-waves.mp3"
    },
    {
      id: 3,
      name: "Floresta Zen",
      duration: "25 min", 
      url: "https://example.com/forest-sounds.mp3"
    },
    {
      id: 4,
      name: "Piano Relaxante",
      duration: "18 min",
      url: "https://example.com/piano-relaxing.mp3"
    }
  ]

  // Dados dos exercícios
  const miniGames = [
    {
      id: 1,
      name: "Respiração Consciente",
      description: "Técnica 4-4-4-4 para reduzir ansiedade",
      icon: "fitness"
    },
    {
      id: 2,
      name: "Meditação Guiada",
      description: "Relaxamento progressivo muscular",
      icon: "heart"
    },
    {
      id: 3,
      name: "Visualização",
      description: "Exercício de imaginação positiva",
      icon: "star"
    }
  ]

  // Função para tocar música
  const playMusic = (music) => {
    try {
      if (currentMusic?.id === music.id) {
        togglePlay()
      } else {
        setCurrentMusic(music)
        setIsPlaying(true)
        setAudioError(false)
      }
    } catch (error) {
      setAudioError(true)
      Alert.alert('Erro', 'Não foi possível reproduzir o áudio')
    }
  }

  // Função para pausar/reproduzir
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Função para ajustar volume
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume)
  }

  // Função para silenciar
  const toggleMute = () => {
    const newVolume = volume === 0 ? 70 : 0
    handleVolumeChange(newVolume)
  }

  // Função para iniciar exercício
  const startGame = (game) => {
    setCurrentGame(game)
    
    if (game.id === 1) {
      startBreathingExercise()
    }
  }

  // Exercício de respiração
  const startBreathingExercise = () => {
    setIsBreathing(true)
    setBreathingCount(1)
    setBreathingPhase('inhale')
    
    const phases = ['inhale', 'hold1', 'exhale', 'hold2']
    let currentPhaseIndex = 0
    let count = 1
    
    const animateBreathing = () => {
      const phase = phases[currentPhaseIndex]
      setBreathingPhase(phase)
      
      // Animação do círculo principal
      Animated.timing(breathingScale, {
        toValue: phase === 'inhale' ? 1.5 : 0.8,
        duration: 4000,
        useNativeDriver: true,
      }).start()
      
      // Animação das partículas
      particleAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: phase === 'inhale' ? 140 : 80,
          duration: 4000,
          useNativeDriver: true,
        }).start()
      })
      
      // Próxima fase
      setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
        if (currentPhaseIndex === 0) {
          count++
          setBreathingCount(count)
        }
        
        if (isBreathing) {
          animateBreathing()
        }
      }, 4000)
    }
    
    animateBreathing()
  }

  // Parar exercício de respiração
  const stopBreathing = () => {
    setIsBreathing(false)
    setCurrentGame(null)
    
    // Reset animações
    Animated.timing(breathingScale, {
      toValue: 0.8,
      duration: 500,
      useNativeDriver: true,
    }).start()
    
    particleAnimations.forEach(anim => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start()
    })
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (isBreathing) {
        stopBreathing()
      }
    }
  }, [])

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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>Bem-estar</Text>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabsContainer, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          onPress={() => handleTabChange("iatec")}
          style={[
            styles.tab,
            { backgroundColor: "#58417d20" }
          ]}
        >
          <Ionicons 
            name="chatbubble-ellipses" 
            size={16} 
            color="#58417d" 
          />
          <Text style={[
            styles.tabText,
            { color: "#58417d" }
          ]}>
            IATEC AI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTabChange("meditation")}
          style={[
            styles.tab,
            activeTab === "meditation" && [styles.tabActive, { backgroundColor: "#8C43FF" }]
          ]}
        >
          <Ionicons 
            name="heart" 
            size={16} 
            color={activeTab === "meditation" ? "#FFFFFF" : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === "meditation" ? "#FFFFFF" : theme.colors.textSecondary }
          ]}>
            Meditação
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Seção de Música */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="musical-notes" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Músicas Relaxantes</Text>
          </View>

          {/* Player atual */}
          {currentMusic && (
            <View style={[styles.currentPlayer, { backgroundColor: theme.colors.surface }]}>
              {audioError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    ⚠️ Erro ao carregar o áudio. Tente outra música.
                  </Text>
                </View>
              )}
              
              <View style={styles.playerHeader}>
                <View style={styles.musicInfo}>
                  <Text style={[styles.musicName, { color: theme.colors.text }]}>{currentMusic.name}</Text>
                  <Text style={[styles.musicDuration, { color: theme.colors.textSecondary }]}>{currentMusic.duration}</Text>
                </View>
                
                <TouchableOpacity
                  onPress={togglePlay}
                  disabled={audioError}
                  style={[
                    styles.playButton,
                    { backgroundColor: theme.colors.primary },
                    audioError && styles.disabledButton
                  ]}
                >
                  <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Controles de volume */}
              <View style={[styles.volumeContainer, { backgroundColor: theme.colors.background }]}>
                <TouchableOpacity onPress={toggleMute} style={styles.volumeButton}>
                  <Ionicons 
                    name={volume === 0 ? "volume-mute" : volume < 50 ? "volume-low" : "volume-high"} 
                    size={20} 
                    color={theme.colors.text} 
                  />
                </TouchableOpacity>
                
                <View style={styles.sliderContainer}>
                  <View style={[styles.sliderTrack, { backgroundColor: theme.colors.border }]}>
                    <View 
                      style={[
                        styles.sliderFill, 
                        { width: `${volume}%`, backgroundColor: theme.colors.primary }
                      ]} 
                    />
                  </View>
                </View>
                
                <Text style={[styles.volumeText, { color: theme.colors.textSecondary }]}>{volume}%</Text>
              </View>
            </View>
          )}

          {/* Lista de músicas */}
          <View style={styles.musicGrid}>
            {musicOptions.map((music) => {
              const isActive = currentMusic?.id === music.id
              return (
                <TouchableOpacity
                  key={music.id}
                  onPress={() => playMusic(music)}
                  style={[
                    styles.musicCard,
                    { backgroundColor: theme.colors.surface },
                    isActive && [styles.activeMusicCard, { backgroundColor: theme.colors.primary }]
                  ]}
                >
                  <View style={styles.musicCardContent}>
                    <View style={styles.musicCardInfo}>
                      <Text style={[
                        styles.musicCardTitle,
                        { color: isActive ? "#FFFFFF" : theme.colors.text }
                      ]}>
                        {music.name}
                      </Text>
                      <Text style={[
                        styles.musicCardDuration,
                        { color: isActive ? "#FFFFFF" : theme.colors.textSecondary }
                      ]}>
                        {music.duration}
                      </Text>
                    </View>
                    
                    {isActive && isPlaying && (
                      <View style={styles.waveform}>
                        <View style={[styles.wave, styles.wave1]} />
                        <View style={[styles.wave, styles.wave2]} />
                        <View style={[styles.wave, styles.wave3]} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Seção de Exercícios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Exercícios de Relaxamento</Text>
          </View>

          <View style={styles.gamesContainer}>
            {miniGames.map((game) => (
              <TouchableOpacity
                key={game.id}
                onPress={() => startGame(game)}
                style={[styles.gameCard, { backgroundColor: theme.colors.surface }]}
              >
                <View style={[styles.gameIcon, { backgroundColor: theme.colors.background }]}>
                  <Ionicons name={game.icon} size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.gameInfo}>
                  <Text style={[styles.gameTitle, { color: theme.colors.text }]}>{game.name}</Text>
                  <Text style={[styles.gameDescription, { color: theme.colors.textSecondary }]}>{game.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Exercício ativo */}
          {currentGame && (
            <View style={[styles.activeGame, { backgroundColor: theme.colors.surface }]}>
              {currentGame.id === 1 ? (
                // Exercício de respiração
                <View style={styles.breathingContainer}>
                  <View style={styles.breathingHeader}>
                    <Text style={[styles.gameActiveTitle, { color: theme.colors.text }]}>
                      {currentGame.name}
                    </Text>
                    <TouchableOpacity
                      onPress={stopBreathing}
                      style={styles.stopButton}
                    >
                      <Text style={styles.stopButtonText}>Parar</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.breathingAnimation}>
                    {/* Círculo externo */}
                    <View style={[styles.breathingCircleOuter, { borderColor: theme.colors.primary + '40' }]} />
                    
                    {/* Círculo principal animado */}
                    <Animated.View
                      style={[
                        styles.breathingCircle,
                        { backgroundColor: theme.colors.primary },
                        {
                          transform: [{ scale: breathingScale }],
                          opacity: breathingOpacity,
                        }
                      ]}
                    >
                      <Text style={styles.breathingCount}>{breathingCount}</Text>
                    </Animated.View>

                    {/* Partículas */}
                    {particleAnimations.map((anim, index) => (
                      <Animated.View
                        key={index}
                        style={[
                          styles.particle,
                          { backgroundColor: theme.colors.primary },
                          {
                            transform: [
                              {
                                translateX: anim.interpolate({
                                  inputRange: [0, 140],
                                  outputRange: [
                                    Math.cos((index * Math.PI * 2) / 8) * 80,
                                    Math.cos((index * Math.PI * 2) / 8) * 140
                                  ]
                                })
                              },
                              {
                                translateY: anim.interpolate({
                                  inputRange: [0, 140],
                                  outputRange: [
                                    Math.sin((index * Math.PI * 2) / 8) * 80,
                                    Math.sin((index * Math.PI * 2) / 8) * 140
                                  ]
                                })
                              }
                            ]
                          }
                        ]}
                      />
                    ))}
                  </View>

                  <View style={styles.breathingInstructions}>
                    <Text style={[styles.breathingText, { color: theme.colors.text }]}>
                      {breathingPhase === 'inhale' && '🌬️ Inspire profundamente'}
                      {(breathingPhase === 'hold1' || breathingPhase === 'hold2') && '⏸️ Segure a respiração'}
                      {breathingPhase === 'exhale' && '😮‍💨 Expire lentamente'}
                    </Text>
                    <Text style={[styles.breathingSubtext, { color: theme.colors.textSecondary }]}>
                      Técnica Box Breathing (4-4-4-4) para ansiedade
                    </Text>
                  </View>
                </View>
              ) : (
                // Outros exercícios
                <View style={styles.otherExercise}>
                  <Text style={[styles.gameActiveTitle, { color: theme.colors.text }]}>{currentGame.name}</Text>
                  <Text style={[styles.exerciseDescription, { color: theme.colors.textSecondary }]}>{currentGame.description}</Text>
                  <View style={styles.comingSoon}>
                    <Text style={styles.comingSoonIcon}>✨</Text>
                    <Text style={[styles.comingSoonText, { color: theme.colors.textSecondary }]}>Exercício em desenvolvimento</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Cuide do seu bem-estar mental e emocional
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  
  // Tabs
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tabActive: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Seções
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: width > 400 ? 20 : 18,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Player de música
  currentPlayer: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderColor: "#F87171",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  musicInfo: {
    flex: 1,
  },
  musicName: {
    fontSize: 16,
    fontWeight: "500",
  },
  musicDuration: {
    fontSize: 14,
    marginTop: 2,
  },
  playButton: {
    borderRadius: 50,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },

  // Controles de volume
  volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "center",
  },
  volumeButton: {
    padding: 6,
    borderRadius: 12,
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 8,
    maxWidth: 100,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
  },
  sliderFill: {
    height: "100%",
    borderRadius: 3,
  },
  volumeText: {
    fontSize: 12,
    fontWeight: "500",
    minWidth: 32,
    textAlign: "center",
  },

  // Grid de músicas
  musicGrid: {
    gap: 12,
  },
  musicCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activeMusicCard: {
    borderWidth: 2,
  },
  musicCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  musicCardInfo: {
    flex: 1,
  },
  musicCardTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  musicCardDuration: {
    fontSize: 14,
  },

  // Waveform
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  wave: {
    width: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  wave1: {
    height: 12,
  },
  wave2: {
    height: 16,
  },
  wave3: {
    height: 12,
  },

  // Exercícios
  gamesContainer: {
    gap: 12,
  },
  gameCard: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  gameIcon: {
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 14,
  },

  // Exercício ativo
  activeGame: {
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  gameActiveTitle: {
    fontSize: 18,
    fontWeight: "500",
  },

  // Exercício de respiração
  breathingContainer: {
    alignItems: "center",
  },
  breathingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
  },
  stopButton: {
    backgroundColor: "#EF4444",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stopButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  breathingAnimation: {
    width: width * 0.7,
    height: width * 0.7,
    maxWidth: 280,
    maxHeight: 280,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 40,
  },
  breathingCircleOuter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: width * 0.35,
    borderWidth: 4,
  },
  breathingCircle: {
    width: width * 0.45,
    height: width * 0.45,
    maxWidth: 180,
    maxHeight: 180,
    borderRadius: width * 0.225,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  breathingCount: {
    fontSize: width > 400 ? 48 : 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  particle: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  breathingInstructions: {
    alignItems: "center",
  },
  breathingText: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  breathingSubtext: {
    fontSize: 14,
    textAlign: "center",
  },

  // Outros exercícios
  otherExercise: {
    alignItems: "center",
  },
  exerciseDescription: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 16,
  },
  comingSoon: {
    alignItems: "center",
    marginTop: 20,
  },
  comingSoonIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 14,
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
  },
})
