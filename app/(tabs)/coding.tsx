import { FloorPicker } from "@/components/floor-picker";
import { ThemedView } from "@/components/themed-view";
import {
  compileProgram,
  type CompilerEvent,
} from "@/helpers/compiler-program";
import { parseNaturalLanguage } from "@/helpers/natural-language";
import {
  CircleHelp,
  Eraser,
  FolderOpen,
  Hammer,
  Play,
  Save,
  Square,
  type LucideIcon,
} from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type NativeSyntheticEvent,
  type TextInputScrollEventData,
  type TextInputSelectionChangeEventData,
} from "react-native";

const CODE_LINE_HEIGHT = 20;
const CODE_FONT_SIZE = 14;
const LINE_NUMBER_FONT_SIZE = 10;
const CODE_PADDING = 12;
const LINE_NUMBERS_WIDTH_PERCENT = "10%";
const MIN_VISIBLE_LINES = 24;

const EDITOR_COLORS = {
  background: "#fafafa",
  gutter: "#f0f0f0",
  gutterBorder: "#ddd",
  tabBar: "#ececec",
  tabActive: "#fafafa",
  statusBar: "#007acc",
  statusBarError: "#c62828",
  activeLine: "#e8f0fe",
  executingLine: "#e8f5e9",
  executingLineCode: "#f1f8e9",
  errorLine: "#fde8e8",
  errorLineCode: "#fff5f5",
  errorAccent: "#e53935",
  text: "#24292e",
  gutterText: "#9ca3af",
  tabText: "#444",
  border: "#ccc",
};

function getCursorPosition(code: string, cursorIndex: number) {
  const beforeCursor = code.slice(0, cursorIndex);
  const line = beforeCursor.split("\n").length;
  const lastNewline = beforeCursor.lastIndexOf("\n");
  const column = cursorIndex - lastNewline;

  return { line, column };
}

export default function CodingScreen() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [programName, setProgramName] = useState("");
  const [level, setLevel] = useState(1);
  const [editorHeight, setEditorHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorColumn, setCursorColumn] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [executingLine, setExecutingLine] = useState<number | null>(null);
  const [runtimeFloor, setRuntimeFloor] = useState(1);
  const [elevatorStatus, setElevatorStatus] = useState("");
  const lineNumbersScrollRef = useRef<ScrollView>(null);
  const shouldContinueRef = useRef(true);

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

    return parseNaturalLanguage(code, { realtime: true, referenceFloor: level }).errors;
  }, [code, level]);

  const visibleLineCount = useMemo(() => {
    if (editorHeight === 0) {
      return MIN_VISIBLE_LINES;
    }

    return Math.max(
      Math.floor((editorHeight - CODE_PADDING * 2) / CODE_LINE_HEIGHT),
      1,
    );
  }, [editorHeight]);

  const codeLineCount = useMemo(() => code.split("\n").length, [code]);

  const lineCount = useMemo(
    () => Math.max(codeLineCount, visibleLineCount),
    [codeLineCount, visibleLineCount],
  );

  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1),
    [lineCount],
  );

  const errorLines = useMemo(
    () => new Set(errors.map((error) => error.line)),
    [errors],
  );

  const handleCompilerEvent = useCallback((event: CompilerEvent) => {
    setElevatorStatus(event.message);

    if (event.line !== undefined && event.type === "status") {
      setExecutingLine(event.line);
    }

    if (event.floor !== undefined) {
      setRuntimeFloor(event.floor);
    }

    if (
      event.type === "complete" ||
      event.type === "error" ||
      event.type === "cancelled"
    ) {
      setExecutingLine(null);
    }
  }, []);

  const runProgram = useCallback(async () => {
    if (isRunning) {
      shouldContinueRef.current = false;
      return;
    }

    const parseResult = parseNaturalLanguage(code, {
      realtime: false,
      referenceFloor: level,
    });
    if (!parseResult.success) {
      handleCompilerEvent({
        type: "error",
        message: t("coding.compileErrors"),
      });
      return;
    }

    shouldContinueRef.current = true;
    setIsRunning(true);
    setElevatorStatus("");
    setRuntimeFloor(level);
    setExecutingLine(null);

    await compileProgram({
      code,
      referenceFloor: level,
      shouldContinue: () => shouldContinueRef.current,
      onEvent: handleCompilerEvent,
    });

    setIsRunning(false);
    setExecutingLine(null);
  }, [handleCompilerEvent, code, isRunning, level, t]);

  const highlightsHeight = CODE_PADDING * 2 + lineCount * CODE_LINE_HEIGHT;

  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    const { line, column } = getCursorPosition(
      code,
      event.nativeEvent.selection.start,
    );
    setCursorLine(line);
    setCursorColumn(column);
  };

  const handleCodeScroll = (
    event: NativeSyntheticEvent<TextInputScrollEventData>,
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
    lineNumbersScrollRef.current?.scrollTo({
      y: offsetY,
      animated: false,
    });
  };

  const codingButtons: {
    key: string;
    Icon: LucideIcon;
    runningIcon?: LucideIcon;
  }[] = [
    { key: "compile", Icon: Hammer, runningIcon: Square },
    { key: "save", Icon: Save },
    { key: "load", Icon: FolderOpen },
    { key: "clear", Icon: Eraser },
    { key: "simulate", Icon: Play },
    { key: "help", Icon: CircleHelp },
  ];

  const handleButtonPress = (key: string) => {
    if (key === "clear") {
      shouldContinueRef.current = false;
      setCode("");
      setCursorLine(1);
      setCursorColumn(1);
      setElevatorStatus("");
      setExecutingLine(null);
      setIsRunning(false);
      setRuntimeFloor(level);
      return;
    }

    if (key === "compile" || key === "simulate") {
      void runProgram();
    }
  };

  const fileName = programName.trim() || t("coding.untitled");

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
            <Text style={styles.levelLabel}>{t("coding.floor")}</Text>
            <View style={styles.pickerWrapper}>
              <FloorPicker
                value={runtimeFloor}
                enabled={!isRunning}
                onValueChange={(itemValue) => {
                  setLevel(itemValue);
                  setRuntimeFloor(itemValue);
                }}
              />
            </View>
          </View>

          <View style={styles.buttonsGroup}>
            {codingButtons.map((button) => {
              const isCompileRunning =
                button.key === "compile" && isRunning;
              const IconComponent =
                isCompileRunning && button.runningIcon
                  ? button.runningIcon
                  : button.Icon;

              return (
                <TouchableOpacity
                  key={button.key}
                  style={[
                    styles.codingButton,
                    isCompileRunning && styles.codingButtonActive,
                  ]}
                  onPress={() => handleButtonPress(button.key)}
                  activeOpacity={0.7}
                >
                  <IconComponent color="#fff" size={16} strokeWidth={2.25} />
                  <Text style={styles.buttonText}>
                    {isCompileRunning
                      ? t("coding.running")
                      : t(`coding.${button.key}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.editorColumn}>
          <View style={styles.editorWrapper}>
            <View style={styles.editorTabBar}>
              <View style={styles.editorTab}>
                <View
                  style={[
                    styles.tabDot,
                    errors.length > 0 ? styles.tabDotError : styles.tabDotOk,
                  ]}
                />
                <Text style={styles.editorTabText} numberOfLines={1}>
                  {fileName}
                </Text>
              </View>
            </View>

            <View
              style={styles.codeEditorContainer}
              onLayout={(event) =>
                handleEditorLayout(event.nativeEvent.layout.height)
              }
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
                  const isActive = cursorLine === lineNumber;
                  const isExecuting = executingLine === lineNumber;

                  return (
                    <View
                      key={lineNumber}
                      style={[
                        styles.lineNumberRow,
                        isExecuting && styles.lineNumberRowExecuting,
                        isActive && !hasError && !isExecuting && styles.lineNumberRowActive,
                        hasError && !isExecuting && styles.lineNumberRowError,
                      ]}
                    >
                      {hasError && <View style={styles.errorMarker} />}
                      <Text
                        style={[
                          styles.lineNumber,
                          isExecuting && styles.lineNumberExecuting,
                          isActive && styles.lineNumberActive,
                          hasError && styles.lineNumberError,
                        ]}
                      >
                        {lineNumber}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>

              <View style={styles.codeArea}>
                <View
                  pointerEvents="none"
                  style={[
                    styles.highlightsLayer,
                    {
                      height: highlightsHeight,
                      transform: [{ translateY: -scrollY }],
                    },
                  ]}
                >
                  {lineNumbers.map((lineNumber) => {
                    const hasError = errorLines.has(lineNumber);
                    const isActive = cursorLine === lineNumber;
                    const isExecuting = executingLine === lineNumber;

                    return (
                      <View
                        key={`highlight-${lineNumber}`}
                        style={[
                          styles.codeLineHighlight,
                          {
                            top:
                              CODE_PADDING +
                              (lineNumber - 1) * CODE_LINE_HEIGHT,
                          },
                          isExecuting && styles.codeLineHighlightExecuting,
                          isActive &&
                            !hasError &&
                            !isExecuting &&
                            styles.codeLineHighlightActive,
                          hasError &&
                            !isExecuting &&
                            styles.codeLineHighlightError,
                        ]}
                      />
                    );
                  })}
                </View>

                <TextInput
                  style={styles.codeInput}
                  multiline
                  editable={!isRunning}
                  placeholder={t("coding.placeholder")}
                  placeholderTextColor="#aaa"
                  value={code}
                  onChangeText={setCode}
                  onSelectionChange={handleSelectionChange}
                  onScroll={handleCodeScroll}
                  textAlignVertical="top"
                  autoCorrect={false}
                  autoCapitalize="none"
                  spellCheck={false}
                  selectionColor="rgba(0, 122, 204, 0.25)"
                />
              </View>
            </View>

            {(isRunning || elevatorStatus) && (
              <View style={styles.elevatorStatusBanner}>
                <Text style={styles.elevatorStatusLabel}>
                  {t("coding.elevatorStatus")}
                </Text>
                <Text style={styles.elevatorStatusText}>
                  {elevatorStatus || t("coding.waiting")}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.statusBar,
                errors.length > 0 && styles.statusBarError,
              ]}
            >
              <Text style={styles.statusBarText}>
                {t("coding.line")} {cursorLine}, {t("coding.column")}{" "}
                {cursorColumn}
              </Text>
              <Text style={styles.statusBarText}>
                {codeLineCount} {t("coding.lines")}
              </Text>
              <Text style={styles.statusBarText}>
                {isRunning
                  ? `${t("coding.running")} · ${t("coding.floor")} ${runtimeFloor}`
                  : errors.length > 0
                    ? `${errors.length} ${t("coding.errors")}`
                    : t("coding.noErrors")}
              </Text>
            </View>
          </View>

          {errors.length > 0 && (
            <View style={styles.problemsPanel}>
              <View style={styles.problemsHeader}>
                <View style={styles.problemsBadge}>
                  <Text style={styles.problemsBadgeText}>{errors.length}</Text>
                </View>
                <Text style={styles.problemsTitle}>{t("coding.problems")}</Text>
              </View>
              <ScrollView style={styles.errorsContainer}>
                {errors.map((error, index) => (
                  <TouchableOpacity
                    key={`${error.code}-${error.line}-${index}`}
                    style={styles.errorRow}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.errorLineLabel}>
                      {t("coding.line")} {error.line}
                    </Text>
                    <Text style={styles.errorText}>{error.message}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
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
  codingSection: {
    flexDirection: "row",
    flex: 1,
    gap: 20,
    overflow: "hidden",
    paddingVertical: 10,
  },
  buttonsColumn: {
    width: 100,
    alignSelf: "stretch",
    justifyContent: "space-between",
  },
  buttonsGroup: {
    flex: 1,
    justifyContent: "space-evenly",
    paddingTop: 6,
  },
  levelContainer: {
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    paddingBottom: 4,
  },
  levelLabel: {
    width: "100%",
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    color: "#444",
    paddingTop: 6,
    paddingBottom: 2,
  },
  pickerWrapper: {
    width: "100%",
    alignItems: "center",
  },
  codingButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  codingButtonActive: {
    backgroundColor: "#c62828",
  },
  buttonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  editorColumn: {
    flex: 1,
    gap: 8,
  },
  editorWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: EDITOR_COLORS.border,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: EDITOR_COLORS.background,
  },
  editorTabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: EDITOR_COLORS.tabBar,
    borderBottomWidth: 1,
    borderBottomColor: EDITOR_COLORS.gutterBorder,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  editorTab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: EDITOR_COLORS.tabActive,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: EDITOR_COLORS.gutterBorder,
    maxWidth: "70%",
    gap: 6,
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tabDotOk: {
    backgroundColor: "#4caf50",
  },
  tabDotError: {
    backgroundColor: EDITOR_COLORS.errorAccent,
  },
  editorTabText: {
    fontSize: 12,
    color: EDITOR_COLORS.tabText,
    fontFamily: "monospace",
  },
  codeEditorContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: EDITOR_COLORS.background,
    overflow: "hidden",
  },
  lineNumbersScroll: {
    width: LINE_NUMBERS_WIDTH_PERCENT,
    maxWidth: 32,
    backgroundColor: EDITOR_COLORS.gutter,
    borderRightWidth: 1,
    borderRightColor: EDITOR_COLORS.gutterBorder,
  },
  lineNumbersContent: {
    paddingTop: CODE_PADDING,
    paddingBottom: CODE_PADDING,
  },
  lineNumberRow: {
    height: CODE_LINE_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    alignSelf: "stretch",
    paddingRight: 2,
  },
  lineNumberRowActive: {
    backgroundColor: EDITOR_COLORS.activeLine,
  },
  lineNumberRowExecuting: {
    backgroundColor: EDITOR_COLORS.executingLine,
  },
  lineNumberRowError: {
    backgroundColor: EDITOR_COLORS.errorLine,
  },
  errorMarker: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: EDITOR_COLORS.errorAccent,
  },
  lineNumber: {
    fontSize: LINE_NUMBER_FONT_SIZE,
    lineHeight: CODE_LINE_HEIGHT,
    fontFamily: "monospace",
    color: EDITOR_COLORS.gutterText,
    textAlign: "right",
  },
  lineNumberActive: {
    color: EDITOR_COLORS.statusBar,
    fontWeight: "600",
  },
  lineNumberExecuting: {
    color: "#2e7d32",
    fontWeight: "700",
  },
  lineNumberError: {
    color: EDITOR_COLORS.errorAccent,
    fontWeight: "700",
  },
  codeArea: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: EDITOR_COLORS.background,
  },
  highlightsLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 0,
  },
  codeLineHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    height: CODE_LINE_HEIGHT,
  },
  codeLineHighlightActive: {
    backgroundColor: EDITOR_COLORS.activeLine,
  },
  codeLineHighlightExecuting: {
    backgroundColor: EDITOR_COLORS.executingLineCode,
  },
  codeLineHighlightError: {
    backgroundColor: EDITOR_COLORS.errorLineCode,
  },
  codeInput: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "transparent",
    paddingTop: CODE_PADDING,
    paddingBottom: CODE_PADDING,
    paddingRight: CODE_PADDING,
    paddingLeft: 4,
    fontSize: CODE_FONT_SIZE,
    lineHeight: CODE_LINE_HEIGHT,
    fontFamily: "monospace",
    color: EDITOR_COLORS.text,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: EDITOR_COLORS.statusBar,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBarError: {
    backgroundColor: EDITOR_COLORS.statusBarError,
  },
  statusBarText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "monospace",
  },
  elevatorStatusBanner: {
    backgroundColor: "#e8f5e9",
    borderTopWidth: 1,
    borderTopColor: EDITOR_COLORS.gutterBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  elevatorStatusLabel: {
    color: "#2e7d32",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  elevatorStatusText: {
    color: "#1b5e20",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  problemsPanel: {
    borderWidth: 1,
    borderColor: "#f5c2c2",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  problemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#f5c2c2",
  },
  problemsBadge: {
    backgroundColor: EDITOR_COLORS.errorAccent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  problemsBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  problemsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  errorsContainer: {
    maxHeight: 100,
  },
  errorRow: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#fce4e4",
  },
  errorLineLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: EDITOR_COLORS.errorAccent,
    fontFamily: "monospace",
    marginBottom: 2,
  },
  errorText: {
    color: "#555",
    fontSize: 12,
    lineHeight: 16,
  },
});
