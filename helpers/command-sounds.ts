import { COMMAND_SOUNDS, type CommandSoundKey } from '@/constants/audio';
import { playSound } from '@/lib/audio';

export function playCommandSound(key: CommandSoundKey): Promise<void> {
  return playSound(COMMAND_SOUNDS[key]);
}

export const commandSounds = {
  startElevatorSound: () => playCommandSound('StartElevator'),
  endElevatorSound: () => playCommandSound('EndElevator'),
  upLevelElevatorSound: () => playCommandSound('UpLevelElevator'),
  downLevelElevatorSound: () => playCommandSound('DownLevelElevator'),
  stopElevatorSound: () => playCommandSound('StopElevator'),
  openDoorSound: () => playCommandSound('OpenDoor'),
  closeDoorSound: () => playCommandSound('CloseDoor'),
} as const;
