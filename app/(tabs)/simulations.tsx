import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ElevatorScene } from "@/components/elevator-scene";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { commandSounds } from "@/helpers/command-sounds";
import {
  getCommandLabels,
  normalizeCommandLanguage,
} from "@/helpers/natural-language";

const BUTTONS_AREA_HEIGHT = 50;

export default function SimulationsScreen() {
  const { t, i18n } = useTranslation();
  const commandLabels = useMemo(
    () => getCommandLabels(normalizeCommandLanguage(i18n.language)),
    [i18n.language],
  );

  const soundButtons = useMemo(
    () =>
      [
        {
          key: "startElevator",
          command: commandLabels.start,
          play: commandSounds.startElevatorSound,
        },
        {
          key: "endElevator",
          command: commandLabels.end,
          play: commandSounds.endElevatorSound,
        },
        {
          key: "upLevelElevator",
          command: commandLabels.up,
          play: commandSounds.upLevelElevatorSound,
        },
        {
          key: "downLevelElevator",
          command: commandLabels.down,
          play: commandSounds.downLevelElevatorSound,
        },
        {
          key: "stopElevator",
          command: commandLabels.stop,
          play: commandSounds.stopElevatorSound,
        },
        {
          key: "openDoor",
          command: commandLabels.open,
          play: commandSounds.openDoorSound,
        },
        {
          key: "closeDoor",
          command: commandLabels.open,
          play: commandSounds.closeDoorSound,
        },
      ] as const,
    [commandLabels],
  );

  const handleButtonPress = (key: (typeof soundButtons)[number]["key"]) => {
    const button = soundButtons.find((item) => item.key === key);
    if (!button) return;

    void button.play();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t("tabs.simulations")}
      </ThemedText>

      <View style={styles.buttonsSection}>
        <ScrollView
          horizontal
          style={styles.buttonsScroll}
          contentContainerStyle={styles.buttonsContainer}
          showsHorizontalScrollIndicator={false}
        >
          {soundButtons.map((button) => (
            <TouchableOpacity
              key={button.key}
              style={styles.soundButton}
              onPress={() => handleButtonPress(button.key)}
              activeOpacity={0.7}
              accessibilityLabel={t(`simulations.${button.key}`)}
            >
              <ThemedText style={styles.commandLabel}>
                {button.command}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sceneSection}>
        <ElevatorScene />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  buttonsSection: {
    height: BUTTONS_AREA_HEIGHT,
  },
  buttonsScroll: {
    height: BUTTONS_AREA_HEIGHT,
  },
  buttonsContainer: {
    height: BUTTONS_AREA_HEIGHT,
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 2,
  },
  sceneSection: {
    flex: 1,
    marginTop: 10,
  },
  soundButton: {
    height: BUTTONS_AREA_HEIGHT,
    minWidth: BUTTONS_AREA_HEIGHT,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  commandLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 16,
  },
});
