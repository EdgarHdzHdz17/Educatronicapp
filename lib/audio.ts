import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioPlayerOptions,
  type AudioSource,
} from 'expo-audio';

import { AUDIO_SOURCES, type AudioSourceKey } from '@/constants/audio';

const SOUND_PLAYER_OPTIONS: AudioPlayerOptions = {
  keepAudioSessionActive: true,
};

let audioModeConfigured = false;
const playerCache = new Map<AudioSource, AudioPlayer>();

export async function configureAudioMode(): Promise<void> {
  if (audioModeConfigured) {
    return;
  }

  await setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: 'mixWithOthers',
  });

  audioModeConfigured = true;
}

function getSoundPlayer(source: AudioSource): AudioPlayer {
  let player = playerCache.get(source);

  if (!player) {
    player = createAudioPlayer(source, SOUND_PLAYER_OPTIONS);
    playerCache.set(source, player);
  }

  return player;
}

export async function playSound(source: AudioSource): Promise<void> {
  await configureAudioMode();

  const player = getSoundPlayer(source);
  await player.seekTo(0);
  player.play();
}

export function playSoundByKey(key: AudioSourceKey): Promise<void> {
  return playSound(AUDIO_SOURCES[key]);
}
