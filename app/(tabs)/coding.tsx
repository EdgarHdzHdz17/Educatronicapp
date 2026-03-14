import { StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function CodingScreen() {
  const { t, i18n } = useTranslation();
  const [code, setCode] = useState("");
  const isSpanish = i18n.language === "es";

  const codingButtons = [
    { key: "compile", labelEs: "Compilar", labelEn: "Compile" },
    { key: "save", labelEs: "Guardar", labelEn: "Save" },
    { key: "load", labelEs: "Cargar Programa", labelEn: "Load Program" },
    { key: "clear", labelEs: "Borrar", labelEn: "Clear" },
    { key: "simulate", labelEs: "Simulación", labelEn: "Simulation" },
    { key: "help", labelEs: "Ayuda", labelEn: "Help" },
  ];

  const handleButtonPress = (key: string) => {
    console.log(`Button pressed: ${key}`);
    if (key === "clear") {
      setCode("");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.codingSection}>
        <View style={styles.buttonsColumn}>
          {codingButtons.map((button) => (
            <TouchableOpacity
              key={button.key}
              style={styles.codingButton}
              onPress={() => handleButtonPress(button.key)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.buttonText}>
                {isSpanish ? button.labelEs : button.labelEn}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.codeInput}
          multiline
          placeholder={
            isSpanish ? "Escribe tu código aquí..." : "Write your code here..."
          }
          placeholderTextColor="#999"
          value={code}
          onChangeText={setCode}
          textAlignVertical="top"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  codingSection: {
    flexDirection: "row",
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonsColumn: {
    width: 150,
    backgroundColor: "#f5f5f5",
    padding: 10,
    justifyContent: "space-around",
  },
  codingButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  codeInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    fontSize: 14,
    fontFamily: "monospace",
    color: "#000",
  },
});
