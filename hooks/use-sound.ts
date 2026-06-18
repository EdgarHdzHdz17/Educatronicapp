import { useCallback, useEffect } from 'react';
import {
  useAudioPlayer,
  type AudioPlayer,
  type AudioPlayerOptions,
  type AudioSource,
} from 'expo-audio';

import { COMMAND_SOUNDS, type CommandSoundKey } from '@/constants/audio';
import { configureAudioMode } from '@/lib/audio';

const DEFAULT_OPTIONS: AudioPlayerOptions = {
  keepAudioSessionActive: true,
};

type UseSoundResult = {
  player: AudioPlayer;
  play: () => Promise<void>;
  pause: () => void;
};

export function useSound(
  source: AudioSource,
  options?: AudioPlayerOptions,
): UseSoundResult {
  const player = useAudioPlayer(source, { ...DEFAULT_OPTIONS, ...options });

  useEffect(() => {
    void configureAudioMode();
  }, []);

  const play = useCallback(async () => {
    await player.seekTo(0);
    player.play();
  }, [player]);

  const pause = useCallback(() => {
    player.pause();
  }, [player]);

  return { player, play, pause };
}

export function useCommandSound(
  key: CommandSoundKey,
  options?: AudioPlayerOptions,
): UseSoundResult {
  return useSound(COMMAND_SOUNDS[key], options);
}
