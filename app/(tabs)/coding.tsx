import { StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function CodingScreen() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");

  const codingButtons = [
    { key: "compile" },
    { key: "save" },
    { key: "load" },
    { key: "clear" },
    { key: "simulate" },
    { key: "help" },
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
                {t(`coding.${button.key}`)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.codeInput}
          multiline
          placeholder={t("coding.placeholder")}
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
    backgroundColor: "",
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
});
