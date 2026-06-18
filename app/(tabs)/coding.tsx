import { StyleSheet, TouchableOpacity, View, TextInput, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { parseNaturalLanguage } from "@/helpers/natural-language";

export default function CodingScreen() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [programName, setProgramName] = useState("");
  const [level, setLevel] = useState(1);

  const errors = useMemo(() => {
    if (!code.trim()) {
      return [];
    }

    return parseNaturalLanguage(code).errors;
  }, [code]);

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
      <View style={styles.topSection}>
        <TextInput
          style={styles.programNameInput}
          placeholder={t("coding.programName")}
          placeholderTextColor="#999"
          value={programName}
          onChangeText={setProgramName}
        />
      </View>

      <View style={styles.codingSection}>
        <View style={styles.buttonsColumn}>
          <View style={styles.levelContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={level}
                onValueChange={(itemValue) => setLevel(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#000"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <Picker.Item
                    key={num}
                    label={`${num}`}
                    value={num}
                    color="#000"
                  />
                ))}
              </Picker>
            </View>
            <ThemedText>Level: {level}</ThemedText>
          </View>

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

        <View style={styles.editorColumn}>
          <TextInput
            style={styles.codeInput}
            multiline
            placeholder={t("coding.placeholder")}
            placeholderTextColor="#999"
            value={code}
            onChangeText={setCode}
            textAlignVertical="top"
          />

          {errors.length > 0 && (
            <ScrollView style={styles.errorsContainer}>
              {errors.map((error, index) => (
                <ThemedText key={`${error.code}-${error.line}-${index}`} style={styles.errorText}>
                  Línea {error.line}: {error.message}
                </ThemedText>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    paddingVertical: 10,
    paddingBottom: 0,
  },
  programNameInput: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
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
    gap: 20,
    overflow: "hidden",
    paddingVertical: 10,
  },
  buttonsColumn: {
    width: 100,
    justifyContent: "flex-start",
  },
  levelContainer: {
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  pickerWrapper: {
    backgroundColor: "#fff",
  },
  picker: {
    width: "100%",
    height: 120,
    color: "#000",
    textAlign: "center",
  },
  pickerItem: {
    height: 120,
    fontSize: 18,
    color: "#000",
  },
  levelText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    paddingVertical: 8,
    backgroundColor: "#007AFF",
    color: "#fff",
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
  editorColumn: {
    flex: 1,
    gap: 8,
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
  errorsContainer: {
    maxHeight: 120,
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#f5c2c2",
    borderRadius: 8,
    padding: 10,
  },
  errorText: {
    color: "#c62828",
    fontSize: 13,
    marginBottom: 4,
  },
});
