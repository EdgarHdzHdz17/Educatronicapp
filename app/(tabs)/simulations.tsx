import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { commandSounds } from '@/helpers/command-sounds';

const soundButtons = [
  { key: 'startElevator', command: 'I', play: commandSounds.startElevatorSound },
  { key: 'endElevator', command: 'F', play: commandSounds.endElevatorSound },
  { key: 'upLevelElevator', command: 'S', play: commandSounds.upLevelElevatorSound },
  { key: 'downLevelElevator', command: 'B', play: commandSounds.downLevelElevatorSound },
  { key: 'stopElevator', command: 'P', play: commandSounds.stopElevatorSound },
  { key: 'openDoor', command: 'A', play: commandSounds.openDoorSound },
  { key: 'closeDoor', command: 'A', play: commandSounds.closeDoorSound },
] as const;

export default function SimulationsScreen() {
  const { t } = useTranslation();

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
