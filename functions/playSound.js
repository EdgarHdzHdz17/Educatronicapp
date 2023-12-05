import { Audio } from "expo-av";

//Reproducir sonido con un delay de 1 seg
const playSound = async (soundFile, times) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      for (let i = 0; i < times; i++) {
        await sound.replayAsync();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.log("Error al reproducir el sonido:", error);
    }
  };

  export default playSound;