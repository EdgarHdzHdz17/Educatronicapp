import { StyleSheet, TouchableOpacity, View, TextInput, ScrollView, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import { useMemo, useRef, useState, useCallback } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { parseNaturalLanguage } from "@/helpers/natural-language";

const CODE_LINE_HEIGHT = 20;
const CODE_FONT_SIZE = 14;
const LINE_NUMBER_FONT_SIZE = 10;
const CODE_PADDING = 12;
const LINE_NUMBERS_WIDTH_PERCENT = "10%";
const MIN_VISIBLE_LINES = 24;

export default function CodingScreen() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [programName, setProgramName] = useState("");
  const [level, setLevel] = useState(1);
  const [editorHeight, setEditorHeight] = useState(0);
  const lineNumbersScrollRef = useRef<ScrollView>(null);

  const handleEditorLayout = useCallback(
    (height: number) => {
      if (height > 0 && height !== editorHeight) {
        setEditorHeight(height);
      }
    },
    [editorHeight],
  );

  const errors = useMemo(() => {
    if (!code.trim()) {
      return [];
    }

    return parseNaturalLanguage(code).errors;
  }, [code]);

  const visibleLineCount = useMemo(() => {
    if (editorHeight === 0) {
      return MIN_VISIBLE_LINES;
    }

    return Math.max(
      Math.floor((editorHeight - CODE_PADDING * 2) / CODE_LINE_HEIGHT),
      1,
    );
  }, [editorHeight]);

  const lineCount = useMemo(() => {
    const codeLines = code.split("\n").length;
    return Math.max(codeLines, visibleLineCount);
  }, [code, visibleLineCount]);

  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1),
    [lineCount],
  );

  const errorLines = useMemo(
    () => new Set(errors.map((error) => error.line)),
    [errors],
  );

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
          <View
            style={styles.codeEditorContainer}
            onLayout={(event) => handleEditorLayout(event.nativeEvent.layout.height)}
          >
            <ScrollView
              ref={lineNumbersScrollRef}
              style={styles.lineNumbersScroll}
              contentContainerStyle={styles.lineNumbersContent}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            >
              {lineNumbers.map((lineNumber) => {
                const hasError = errorLines.has(lineNumber);

                return (
                  <View
                    key={lineNumber}
                    style={[
                      styles.lineNumberRow,
                      hasError && styles.lineNumberRowError,
                    ]}
                  >
                    <Text
                      style={[
                        styles.lineNumber,
                        hasError && styles.lineNumberError,
                      ]}
                    >
                      {lineNumber}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            <TextInput
              style={styles.codeInput}
              multiline
              placeholder={t("coding.placeholder")}
              placeholderTextColor="#999"
              value={code}
              onChangeText={setCode}
              onScroll={(event) => {
                lineNumbersScrollRef.current?.scrollTo({
                  y: event.nativeEvent.contentOffset.y,
                  animated: false,
                });
              }}
              textAlignVertical="top"
            />
          </View>

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
  codeEditorContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  lineNumbersScroll: {
    width: LINE_NUMBERS_WIDTH_PERCENT,
    maxWidth: 32,
    backgroundColor: "#f5f5f5",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  lineNumbersContent: {
    paddingTop: CODE_PADDING,
    paddingBottom: CODE_PADDING,
  },
  lineNumberRow: {
    height: CODE_LINE_HEIGHT,
    justifyContent: "center",
    alignSelf: "stretch",
    paddingLeft: 1,
    paddingRight: 2,
  },
  lineNumberRowError: {
    backgroundColor: "#fde8e8",
  },
  lineNumber: {
    fontSize: LINE_NUMBER_FONT_SIZE,
    lineHeight: CODE_LINE_HEIGHT,
    fontFamily: "monospace",
    color: "#aaa",
    textAlign: "right",
  },
  lineNumberError: {
    color: "#c62828",
    fontWeight: "700",
  },
  codeInput: {
    flex: 1,
    paddingTop: CODE_PADDING,
    paddingBottom: CODE_PADDING,
    paddingRight: CODE_PADDING,
    paddingLeft: 4,
    fontSize: CODE_FONT_SIZE,
    lineHeight: CODE_LINE_HEIGHT,
    fontFamily: "monospace",
    color: "#000",
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
