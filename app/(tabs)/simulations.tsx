import { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ElevatorScene } from '@/components/elevator-scene';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { commandSounds } from '@/helpers/command-sounds';
import {
  getCommandLabels,
  normalizeCommandLanguage,
} from '@/helpers/natural-language';

export default function SimulationsScreen() {
  const { t, i18n } = useTranslation();
  const commandLabels = useMemo(
    () => getCommandLabels(normalizeCommandLanguage(i18n.language)),
    [i18n.language],
  );

  const soundButtons = useMemo(
    () => [
      {
        key: 'startElevator',
        command: commandLabels.start,
        play: commandSounds.startElevatorSound,
      },
      {
        key: 'endElevator',
        command: commandLabels.end,
        play: commandSounds.endElevatorSound,
      },
      {
        key: 'upLevelElevator',
        command: commandLabels.up,
        play: commandSounds.upLevelElevatorSound,
      },
      {
        key: 'downLevelElevator',
        command: commandLabels.down,
        play: commandSounds.downLevelElevatorSound,
      },
      {
        key: 'stopElevator',
        command: commandLabels.stop,
        play: commandSounds.stopElevatorSound,
      },
      {
        key: 'openDoor',
        command: commandLabels.open,
        play: commandSounds.openDoorSound,
      },
      {
        key: 'closeDoor',
        command: commandLabels.open,
        play: commandSounds.closeDoorSound,
      },
    ] as const,
    [commandLabels],
  );

  const handleButtonPress = (key: (typeof soundButtons)[number]['key']) => {
    const button = soundButtons.find((item) => item.key === key);
    if (!button) return;

    void button.play();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.buttonsSection}>
        <ThemedText type="title" style={styles.title}>
          {t('tabs.simulations')}
        </ThemedText>

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
            >
              <ThemedText style={styles.commandLabel}>{button.command}</ThemedText>
              <ThemedText style={styles.buttonText}>
                {t(`simulations.${button.key}`)}
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
  buttonsSection: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonsScroll: {
    flex: 1,
  },
  buttonsContainer: {
    flexGrow: 1,
    alignItems: 'stretch',
    gap: 10,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  sceneSection: {
    flex: 2,
    marginTop: 8,
  },
  soundButton: {
    width: 112,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 6,
  },
  commandLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 15,
  },
});
