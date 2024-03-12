import React, { useState } from "react";
import { View, Text, Dimensions, Alert, TouchableOpacity } from "react-native";
import { FontAwesome5, AntDesign, FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import axios from "axios";
import SVGTop from "../components/SVGTop";
import SVGSimulation from "../components/SVGSimulation";
import styles from "../styles/SimulationStyles";
import playSound from "../functions/playSound";
import openDoorSound from "../functions/openDoorSound";
import closeDoorSound from "../functions/closeDoorSound";
import upElevatorSound from "../functions/upElevatorSound";
import downElevatorSound from "../functions/downElevatorSound";
import stopSound from "../functions/stopSound";
import { levelsElevator, doorElevator } from "../functions/elevatorConstants";
import { SafeAreaView } from "react-native";

//Componente principal
export default function SimulationScreen() {
  const [recording, setRecording] = useState(); //Variable y funcion para grabacion de un audio
  const [recordings, setRecordings] = useState([]); //Variable y funcion para grabaciones de audios
  const navigation = useNavigation(); //Permite hacer la navegacion para los iconos
  const sectionBuildWidth = Dimensions.get("window").width;
  const sectionBuildHeight = Dimensions.get("window").height * 0.7;
  const [currentLevelXElevator, setCurrentLevelXElevator] = useState(
    levelsElevator[0]
  ); //Nivel Inicial del elevador
  const [currentDoorElevator, setCurrentDoorElevator] = useState(
    doorElevator[1]
  ); //Posicion inicial de la puerta

  //Funcion para iniciar grabacion
  async function startRecording() {
    try {
      //Permisos de microfono
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        //Configuracion del audio
        const recordingOptions = {
          android: {
            extension: ".wav",
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WAV,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_ACC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: ".wav",
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        };
        const { recording } = await Audio.Recording.createAsync(
          recordingOptions
        );
        setRecording(recording);
      } else {
        console.error("No se acepto los permisos");
      }
    } catch (err) {
      console.error("Fallo en accesibilidad", err);
    }
  }

  //Detencion de grabacion
  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    let updatedRecordings = [...recordings];
    //Nueva localizacion del archivo de audio
    const fileUri = `${FileSystem.documentDirectory}recording${Date.now()}.wav`;
    await FileSystem.copyAsync({
      from: recording.getURI(),
      to: fileUri,
    });
    const { sound } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      file: fileUri,
    });
    setRecordings(updatedRecordings); //Actualizamos la lista de grabacione
    translateSpeechToText(fileUri); //Mandamos a llamar a translateSpeechToText
    setRecordings([]); //Limpiamos la lista de grabaciones
  }

  //Llamada al API de Open AI
  async function translateSpeechToText(fileUri) {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type: "audio/x-wav",
        name: "audio.wav",
      });
      formData.append("model", "whisper-1");
      formData.append("response_format", "text");
      formData.append("language", "es");
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer APIKEY",
          },
        }
      );

      const resultSpeech = response.data; //Resultado del reconocimiento del API

      console.log(resultSpeech); //Resultado del reconocimiento del API en concola

      //Comando para activar ir Ver simulacion por voz
      if (
        resultSpeech.includes("Simular") ||
        resultSpeech.includes("simular") ||
        resultSpeech.includes("SIMULAR")
      ) {
        await playSound(require("../assets/audio/soundCorrect.mp3"), 1);
        navigation.navigate("Simulations");
        Speech.speak("Comando Simular detectado");
      }
      //Comando para activar ir Programar por voz
      if (
        resultSpeech.includes("Programar") ||
        resultSpeech.includes("programar") ||
        resultSpeech.includes("PROGRAMAR")
      ) {
        await playSound(require("../assets/audio/soundCorrect.mp3"), 1);
        navigation.navigate("Coding");
        Speech.speak("Comando Programar detectado");
      }
      //Comando para activar ir Inicio por voz
      if (
        resultSpeech.includes("Casa") ||
        resultSpeech.includes("casa") ||
        resultSpeech.includes("CASA")
      ) {
        await playSound(require("../assets/audio/soundCorrect.mp3"), 1);
        navigation.navigate("Home");
        Speech.speak("Comando Inicio detectado");
      }

      //Comando para activar ir Ayuda de App por voz
      if (
        resultSpeech.includes("Tutorial") ||
        resultSpeech.includes("tutorial") ||
        resultSpeech.includes("TUTORIAL")
      ) {
        await playSound(require("../assets/audio/soundCorrect.mp3"), 1);
        navigation.navigate("HelpAppScreen");
        Speech.speak("Comando Tutorial detectado");
      }

      //Comandos para control de elevador
      if (resultSpeech.includes("Sube") || resultSpeech.includes("sube")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"), 1);
        upNextLevelElevator();
      }

      if (resultSpeech.includes("Baja") || resultSpeech.includes("baja")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"), 1);
        downNextLevelElevator();
      }

      if (resultSpeech.includes("Abrir") || resultSpeech.includes("abrir")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"), 1);
        openDoor();
      }

      if (resultSpeech.includes("Cerrar") || resultSpeech.includes("cerrar")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"), 1);
        closeDoor();
      }

      if (
        resultSpeech.includes("Detener") ||
        resultSpeech.includes("detener")
      ) {
        await playSound(require("../assets/audio/soundCorrect.mp3"), 1);
        stopSound();
      }

      if (
        !resultSpeech.includes("simular") &&
        !resultSpeech.includes("Simular") &&
        !resultSpeech.includes("SIMULAR") &&
        !resultSpeech.includes("casa") &&
        !resultSpeech.includes("Casa") &&
        !resultSpeech.includes("CASA") &&
        !resultSpeech.includes("programar") &&
        !resultSpeech.includes("Programar") &&
        !resultSpeech.includes("PROGRAMAR") &&
        !resultSpeech.includes("sube") &&
        !resultSpeech.includes("Sube") &&
        !resultSpeech.includes("baja") &&
        !resultSpeech.includes("Baja") &&
        !resultSpeech.includes("abrir") &&
        !resultSpeech.includes("Abrir") &&
        !resultSpeech.includes("cerrar") &&
        !resultSpeech.includes("Cerrar") &&
        !resultSpeech.includes("detener") &&
        !resultSpeech.includes("Detener") &&
        !resultSpeech.includes("tutorial") &&
        !resultSpeech.includes("Tutorial") &&
        !resultSpeech.includes("TUTORIAL")
      ) {
        await playSound(require("../assets/audio/incorrectSound.mp3"), 1);
        Speech.speak(
          `Comando'${resultSpeech}'no valido o posiblemente no lo detecte bien`
        );
      }
    } catch (error) {
      console.error("Fallo de transcripcion", { ...error });
      Alert.alert(
        "Error",
        "El reconocimiento de voz no es posible en Android o hubo un error externo."
      );
    }

    //Eliminamos el archivo del App
    try {
      await FileSystem.deleteAsync(fileUri);
    } catch (error) {
      console.error(
        `Error al eliminar el archivo ${fileUri}: ${error.message}`
      );
    }
  }

  //Funcion para cerrar puerta
  function closeDoor() {
    if (currentDoorElevator === doorElevator[1]) {
      Alert.alert("Puerta cerrada", "No se puede cerrar la puerta");
    } else {
      console.log("Cerrando puertas");
      setCurrentDoorElevator(doorElevator[1]);
      console.log("Deteniendo puertas");
      closeDoorSound();
    }
  }

  //Funcion para abrir puerta
  function openDoor() {
    if (currentDoorElevator === doorElevator[0]) {
      Alert.alert("Puerta abierta", "No se puede abrir la puerta");
    } else {
      console.log("Abriendo puertas");
      setCurrentDoorElevator(doorElevator[0]);
      console.log("Deteniendo puertas");
      openDoorSound();
    }
  }

  //Funcion para recorrer el elevador de 1 en 1 cada que se presiona el boton subir
  function upNextLevelElevator() {
    if (currentDoorElevator === doorElevator[0]) {
      Alert.alert("Puerta abierta", "No se puede subir con la puerta abierta");
    } else {
      setCurrentLevelXElevator((prevLevel) => {
        const currentIndex = levelsElevator.indexOf(prevLevel);
        if (currentIndex < levelsElevator.length - 1) {
          const nextLevel = levelsElevator[currentIndex + 1];
          console.log(
            `Subiendo al nivel ${levelsElevator.indexOf(nextLevel) + 1}`
          );
          upElevatorSound();
          return nextLevel;
        } else {
          Alert.alert("Nivel Máximo", "Ya no se puede subir más");
          return prevLevel;
        }
      });
    }
  }

  //Funcion para recorrer el elevador de 1 en 1 cada que se presiona el boton bajar
  function downNextLevelElevator() {
    if (currentDoorElevator === doorElevator[0]) {
      Alert.alert("Puerta abierta", "No se puede bajar con la puerta abierta");
    } else {
      setCurrentLevelXElevator((prevLevel) => {
        const currentIndex = levelsElevator.indexOf(prevLevel);
        if (currentIndex > 0) {
          const nextLevel = levelsElevator[currentIndex - 1];
          console.log(
            `Bajando al nivel ${levelsElevator.indexOf(nextLevel) + 1}`
          );
          downElevatorSound();
          return nextLevel;
        } else {
          Alert.alert("Nivel Minimo", "Ya no se puede bajar más");
          return prevLevel;
        }
      });
    }
  }

  return (
    <SafeAreaView style={styles.maincontainer}>
      <View
        style={[styles.containerSVG, { flex: 1.5, backgroundColor: "#56D0F6" }]}
      >
        <SVGTop />
      </View>

      <View style={[styles.sectionforIcons, { flex: 1, flexDirection: "row" }]}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <AntDesign
            name="caretup"
            size={30}
            color="black"
            onPress={upNextLevelElevator}
          />
          <Text style={styles.textScreen}>Subir</Text>
        </View>

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <AntDesign
            name="caretdown"
            size={30}
            color="black"
            onPress={downNextLevelElevator}
          />
          <Text style={styles.textScreen}>Bajar</Text>
        </View>

        <TouchableOpacity
          style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
          onPress={openDoor}
        >
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="stepbackward" size={30} color="black" />
            <AntDesign name="stepforward" size={30} color="black" />
          </View>
          <Text style={styles.textScreen}>Abrir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
          onPress={closeDoor}
        >
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="stepforward" size={30} color="black" />
            <AntDesign name="stepbackward" size={30} color="black" />
          </View>
          <Text style={styles.textScreen}>Cerrar</Text>
        </TouchableOpacity>

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <FontAwesome
            name="stop"
            size={30}
            color="black"
            onPress={stopSound}
          />
          <Text style={styles.textScreen}>Detener</Text>
        </View>
      </View>

      <View
        style={[
          styles.sectionforElementsSimulations,
          { flex: 9, marginLeft: 10 },
        ]}
      >
        <SVGSimulation
          pathWidth={sectionBuildWidth}
          pathHeight={sectionBuildHeight}
          levelXElevator={currentLevelXElevator}
          statusDoor={currentDoorElevator}
        />
      </View>

      <TouchableOpacity style={styles.recordButtonContainer}>
        <FontAwesome5
          name={recording ? "microphone-slash" : "microphone"}
          size={35}
          color="#f0ffff"
          onPress={recording ? stopRecording : startRecording}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
