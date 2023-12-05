import { Audio } from "expo-av";

//Reproducir sonido para detener
const stopSound = async () => {
    try {
      const soundObject1 = new Audio.Sound();
      await soundObject1.loadAsync(require('../assets/audio/dtmf_3.wav'));
      await soundObject1.playAsync();
    } catch (error) {
      console.error('Error reproduciendo el sonido:', error);
    }
  };

  export default stopSound;