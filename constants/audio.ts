export const COMMAND_SOUNDS = {
  StartElevator: require('@/assets/audio/dtmf_12.wav'),
  EndElevator: require('@/assets/audio/dtmf_d.wav'),
  UpLevelElevator: require('@/assets/audio/dtmf_2.wav'),
  DownLevelElevator: require('@/assets/audio/dtmf_1.wav'),
  StopElevator: require('@/assets/audio/dtmf_3.wav'),
  OpenDoor: require('@/assets/audio/dtmf_8.wav'),
  CloseDoor: require('@/assets/audio/dtmf_4.wav'),
} as const;

export type CommandSoundKey = keyof typeof COMMAND_SOUNDS;
