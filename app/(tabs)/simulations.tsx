import {
  ArrowDown,
  ArrowUp,
  DoorClosed,
  DoorOpen,
  Octagon,
  Play,
  Square,
  type LucideIcon,
} from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ElevatorScene } from "@/components/elevator-scene";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { commandSounds } from "@/helpers/command-sounds";

const BUTTONS_AREA_HEIGHT = 56;

type SoundButtonKey =
  | "startElevator"
  | "endElevator"
  | "upLevelElevator"
  | "downLevelElevator"
  | "stopElevator"
  | "openDoor"
  | "closeDoor";

type SoundButtonConfig = {
  key: SoundButtonKey;
  Icon: LucideIcon;
  play: () => Promise<void>;
};

const SOUND_BUTTONS: SoundButtonConfig[] = [
  { key: "startElevator", Icon: Play, play: commandSounds.startElevatorSound },
  { key: "endElevator", Icon: Square, play: commandSounds.endElevatorSound },
  {
    key: "upLevelElevator",
    Icon: ArrowUp,
    play: commandSounds.upLevelElevatorSound,
  },
  {
    key: "downLevelElevator",
    Icon: ArrowDown,
    play: commandSounds.downLevelElevatorSound,
  },
  { key: "stopElevator", Icon: Octagon, play: commandSounds.stopElevatorSound },
  { key: "openDoor", Icon: DoorOpen, play: commandSounds.openDoorSound },
  { key: "closeDoor", Icon: DoorClosed, play: commandSounds.closeDoorSound },
];

export default function SimulationsScreen() {
  const { t } = useTranslation();

  const soundButtons = useMemo(() => SOUND_BUTTONS, []);

  const handleButtonPress = (key: SoundButtonKey) => {
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
          {soundButtons.map(({ key, Icon }) => (
            <TouchableOpacity
              key={key}
              style={styles.soundButton}
              onPress={() => handleButtonPress(key)}
              activeOpacity={0.7}
              accessibilityLabel={t(`simulations.${key}`)}
            >
              <Icon color="#fff" size={18} strokeWidth={2.5} />
              <ThemedText style={styles.buttonLabel} numberOfLines={1}>
                {t(`simulations.${key}`)}
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
    minWidth: 72,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    gap: 3,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 11,
  },
});
