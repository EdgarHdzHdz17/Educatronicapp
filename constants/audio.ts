export const AUDIO_SOURCES = {
  dtmf_1: require('@/assets/audio/dtmf_1.wav'),
  dtmf_2: require('@/assets/audio/dtmf_2.wav'),
  dtmf_3: require('@/assets/audio/dtmf_3.wav'),
  dtmf_4: require('@/assets/audio/dtmf_4.wav'),
  dtmf_8: require('@/assets/audio/dtmf_8.wav'),
  dtmf_12: require('@/assets/audio/dtmf_12.wav'),
  dtmf_d: require('@/assets/audio/dtmf_d.wav'),
} as const;

export type AudioSourceKey = keyof typeof AUDIO_SOURCES;
