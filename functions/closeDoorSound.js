import { Audio } from "expo-av";

//Reproducir sonido para cerrar
  const closeDoorSound = async () => {
    try {
      const soundObject1 = new Audio.Sound();
      await soundObject1.loadAsync(require('../assets/audio/dtmf_4.wav'));
      await soundObject1.playAsync();
  
      // Esperamos 300 ms
      await new Promise(resolve => setTimeout(resolve, 400));
  
      const soundObject2 = new Audio.Sound();
      await soundObject2.loadAsync(require('../assets/audio/dtmf_3.wav'));
      await soundObject2.playAsync();
    } catch (error) {
      console.error('Error reproduciendo el sonido:', error);
    }
  };

export default closeDoorSound;