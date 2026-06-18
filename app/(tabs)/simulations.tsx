import { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

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

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('tabs.simulations')}
      </ThemedText>

      <ScrollView
        contentContainerStyle={styles.buttonsContainer}
        showsVerticalScrollIndicator={false}
      >
        {soundButtons.map((button) => (
          <TouchableOpacity
            key={button.key}
            style={styles.soundButton}
            onPress={() => void button.play()}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.commandLabel}>{button.command}</ThemedText>
            <ThemedText style={styles.buttonText}>
              {t(`simulations.${button.key}`)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    gap: 10,
    paddingBottom: 24,
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
  },
  commandLabel: {
    width: 28,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
