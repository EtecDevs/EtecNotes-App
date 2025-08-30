"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Vibration } from "react-native"
import { useTheme } from "../context/ThemeContext"

const { width } = Dimensions.get("window")

export default function CalculatorScreen() {
  const { theme } = useTheme()
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num) => {
    Vibration.vibrate(50)

    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? String(num) : display + num)
    }
  }

  const inputDecimal = () => {
    Vibration.vibrate(50)

    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const clear = () => {
    Vibration.vibrate(100)
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation) => {
    Vibration.vibrate(50)
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const percentage = () => {
    Vibration.vibrate(50)
    const value = Number.parseFloat(display)
    setDisplay(String(value / 100))
  }

  const toggleSign = () => {
    Vibration.vibrate(50)
    const value = Number.parseFloat(display)
    setDisplay(String(value * -1))
  }

  const formatDisplay = (value) => {
    if (value.length > 12) {
      return Number.parseFloat(value).toExponential(6)
    }
    return value
  }

  const styles = createStyles(theme)

  const Button = ({ onPress, title, style, textStyle }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calculadora</Text>
      </View>

      {/* Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.display} numberOfLines={1} adjustsFontSizeToFit>
          {formatDisplay(display)}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        {/* Row 1 */}
        <View style={styles.row}>
          <Button title="C" onPress={clear} style={styles.functionButton} textStyle={styles.functionButtonText} />
          <Button title="±" onPress={toggleSign} style={styles.functionButton} textStyle={styles.functionButtonText} />
          <Button title="%" onPress={percentage} style={styles.functionButton} textStyle={styles.functionButtonText} />
          <Button
            title="÷"
            onPress={() => performOperation("÷")}
            style={[styles.operatorButton, operation === "÷" && styles.operatorButtonActive]}
            textStyle={styles.operatorButtonText}
          />
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <Button title="7" onPress={() => inputNumber(7)} />
          <Button title="8" onPress={() => inputNumber(8)} />
          <Button title="9" onPress={() => inputNumber(9)} />
          <Button
            title="×"
            onPress={() => performOperation("×")}
            style={[styles.operatorButton, operation === "×" && styles.operatorButtonActive]}
            textStyle={styles.operatorButtonText}
          />
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <Button title="4" onPress={() => inputNumber(4)} />
          <Button title="5" onPress={() => inputNumber(5)} />
          <Button title="6" onPress={() => inputNumber(6)} />
          <Button
            title="-"
            onPress={() => performOperation("-")}
            style={[styles.operatorButton, operation === "-" && styles.operatorButtonActive]}
            textStyle={styles.operatorButtonText}
          />
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          <Button title="1" onPress={() => inputNumber(1)} />
          <Button title="2" onPress={() => inputNumber(2)} />
          <Button title="3" onPress={() => inputNumber(3)} />
          <Button
            title="+"
            onPress={() => performOperation("+")}
            style={[styles.operatorButton, operation === "+" && styles.operatorButtonActive]}
            textStyle={styles.operatorButtonText}
          />
        </View>

        {/* Row 5 */}
        <View style={styles.row}>
          <Button title="0" onPress={() => inputNumber(0)} style={styles.zeroButton} />
          <Button title="." onPress={inputDecimal} />
          <Button
            title="="
            onPress={() => performOperation("=")}
            style={styles.equalsButton}
            textStyle={styles.operatorButtonText}
          />
        </View>
      </View>
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
    displayContainer: {
      flex: 1,
      justifyContent: "flex-end",
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    display: {
      fontSize: 64,
      fontWeight: "300",
      color: theme.colors.text,
      textAlign: "right",
      minHeight: 80,
    },
    buttonsContainer: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    row: {
      flexDirection: "row",
      marginBottom: 16,
      gap: 16,
    },
    button: {
      flex: 1,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    buttonText: {
      fontSize: 28,
      fontWeight: "400",
      color: theme.colors.text,
    },
    functionButton: {
      backgroundColor: theme.colors.border,
    },
    functionButtonText: {
      color: theme.colors.text,
      fontWeight: "500",
    },
    operatorButton: {
      backgroundColor: theme.colors.primary,
    },
    operatorButtonActive: {
      backgroundColor: theme.colors.primaryLight,
      transform: [{ scale: 0.95 }],
    },
    operatorButtonText: {
      color: "white",
      fontWeight: "500",
    },
    equalsButton: {
      backgroundColor: theme.colors.primary,
    },
    zeroButton: {
      flex: 2,
      marginRight: 16,
    },
  })
