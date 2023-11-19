import React,{useState} from "react";
import { View,Text, StyleSheet,Dimensions,Alert,TouchableOpacity,Platform} from "react-native";
import Svg, { Path } from "react-native-svg";
import {FontAwesome5,AntDesign,FontAwesome} from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import * as Speech from "expo-speech";
import axios from 'axios';

//Componente SVG Top
function SVGTop() {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={321} height={70} fill="none">
      <Path fill="#56D0F6" d="M0 25C0 11.193 11.193 0 25 0h271c13.807 0 25 11.193 25 25v53H0V25Z"/>
      <Path fill="#F9FCFF" fillRule="evenodd" d="M259.321 60h-59.062C190.727 60 183 52.62 183 43.517c0-9.103 7.727-16.482 17.259-16.482 1.993 0 3.908.323 5.69.917C209.377 22.019 215.992 18 223.59 18c6.731 0 12.69 3.154 16.346 8a18.9 18.9 0 0 1 1.551-.064c6.451 0 12.102 3.271 15.234 8.172a14.379 14.379 0 0 1 2.6-.236c7.555 0 13.679 5.849 13.679 13.064S266.876 60 259.321 60ZM120.366 41.907c.488-1.779.527-3.686.022-5.57-1.586-5.919-7.936-9.36-14.183-7.687-3.543.95-6.293 3.341-7.72 6.313-2.386-1.37-5.36-1.826-8.308-1.036-3.905 1.047-6.755 4.007-7.706 7.504-.858.025-1.729.15-2.598.382-5.714 1.531-9.17 7.161-7.72 12.575 1.451 5.415 7.26 8.562 12.973 7.031a11.118 11.118 0 0 0 4.847-2.721c2.574 2.466 6.457 3.55 10.298 2.522a11.08 11.08 0 0 0 5.355-3.245c2.604 3.679 7.492 5.508 12.317 4.215 6.107-1.636 9.8-7.653 8.25-13.438-.836-3.122-3.028-5.538-5.827-6.845Z"
      clipRule="evenodd"
      />
    </Svg>
  );
}

//Componente SVG Simulacion
function SVGSimulation({ pathWidth, pathHeight,levelXElevator,statusDoor}) {

  //Componentes del edificio
  const widthBuild = pathWidth * 0.5; // Ancho del edificio
  const heightBuild = pathHeight * 1 ; // Alto del edificio

  const widthWindow = widthBuild * 0.3; // Ancho de la ventana
  const heightWindow = heightBuild * 0.09;// Alto de la ventana

  const widthWindowLevel1 = widthBuild * 0.15; // Ancho de la ventana del nivel 1
  const heightWindowLevel1 = heightBuild * 0.15;// Alto de la ventana del nivel 1

  const heightDoorLevel1= heightBuild * 0.25;// Alto de la puerta del nivel 1
  const widthDoorLevel1 = widthBuild * 0.15; // Ancho de la puerta del nivel 1

  const window1PositionX = ((widthBuild - widthWindow) / 2) - (widthBuild * 0.20);//Posicion de las ventanas izquierdas en X
  const window2PositionX = ((widthBuild + widthWindow) / 2) - (widthBuild * 0.10);//Posicion de las ventanas derechas en X

  const door1PositionX = ((widthBuild - widthWindow) / 2) - (widthBuild * 0.01);//Posicion de la puerta izquierda en X
  const door2PositionX = ((widthBuild + widthWindow) / 2) - (widthBuild * 0.15);//Posicion de la puerta derecha en X

  const window1Level1PositionX = ((widthBuild - widthWindow) / 2) - (widthBuild * 0.25);//Posicion de la ventana izquierda del nivel 1 en X
  const window2Level1PositionX = ((widthBuild + widthWindow) / 2) - (widthBuild * -0.10);//Posicion de la ventana derecha del nivel 1 en X

  const windowsLevel1PositionY =  heightBuild * 0.80; // 65%

  //Posicion de las ventanas dentro del edificio
  const windowLevel7 = heightBuild * 0.10; // 10%
  const windowLevel6 = heightBuild * 0.20; // 20% 
  const windowLevel5 = heightBuild * 0.30; // 30% 
  const windowLevel4 = heightBuild * 0.40; // 40% 
  const windowLevel3 = heightBuild * 0.50; // 50% 
  const windowLevel2 = heightBuild * 0.60; // 60% 
  const windowLevel1 = heightBuild * 0.74; // 74%

  //Componentes del elevador
  const widthElevator = pathWidth * 0.15; // Ancho del elevador
  const heightElevator = pathHeight * 0.2 ; // Alto del elevador 

  const PositionXElevator = (pathWidth-widthBuild*0.6)//Posicion del elevador en el eje X

  const heightDoorElevator= heightElevator * 0.85;// Alto de la puerta del elevador
  const widthDoorElevator = widthElevator * 0.60; // Ancho de la puerta del elevador

  const halfElevatorHeight = heightElevator * 0.5;//Calcula la mitad de la altura del elevador

  const doorPositionYElevator = levelXElevator - (halfElevatorHeight * -0.30);//La posicion en Y de la puerta del elevador se desplaza cada que cambia la posicion el elevador

  //Componentes del marco de la puerta
  const heightFrameDoorElevator= heightElevator * 0.88;// Alto del contorno de la puerta
  const widthFrameDoorElevator = widthElevator * 0.70; // Ancho del contorno de la puerta
  const positionFrameDoor = (pathWidth-widthBuild*0.555)//Posicion del marco de la puerta en X
  const doorFramePositionYElevator = levelXElevator - (halfElevatorHeight * -0.23);////Posicion del marco en Y

  //Componentes del indicador del elevador
  const heightIndicatorElevator= heightElevator * 0.08;// Alto del indicador de la puerta
  const widthIndicatorElevator = widthElevator * 0.50; // Ancho del indicador de la puerta
  const positionIndicatorElevator = (pathWidth-widthBuild*0.52)//Posicion del indicador de la puerta en X
  const indicatorPositionYElevator = levelXElevator - (halfElevatorHeight * -0.03);//Posicion del indicador en Y

  //Componentes del control del elevador
  const heightControlElevator= heightElevator * 0.08;// Alto del control de la puerta
  const widthControlElevator = widthElevator * 0.08; // Ancho del control de la puerta
  const positionControlElevator = (pathWidth-widthBuild*0.335)//Posicion del control de la puerta en X
  const controlPositionYElevator = levelXElevator - (halfElevatorHeight * -0.99);////Posicion del control en Y
  
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={pathWidth} height={pathHeight} fill="none">
      <Path fill="#F2994A" d={`M0 0h${widthBuild}v${heightBuild}H0z`}/*Build*/ />
      <Path fill="#cd853f" d={`M${PositionXElevator} ${levelXElevator}h${widthElevator}v${heightElevator}H${PositionXElevator}z`}/*Elevator*/ />
      <Path fill="#a9a9a9" d={`M${positionFrameDoor} ${doorFramePositionYElevator}h${widthFrameDoorElevator}v${heightFrameDoorElevator}H${positionFrameDoor}z`}/*Mark*/ />
      <Path fill="#a9a9a9" d={`M${positionIndicatorElevator} ${indicatorPositionYElevator}h${widthIndicatorElevator}v${heightIndicatorElevator}H${positionIndicatorElevator}z`}/*Indicator*/ />
      <Path fill="#a9a9a9" d={`M${positionControlElevator} ${controlPositionYElevator}h${widthControlElevator}v${heightControlElevator}H${positionControlElevator}z`}/*Control*/ />
      <Path fill="#8b4513" d={`M${statusDoor} ${doorPositionYElevator}h${widthDoorElevator}v${heightDoorElevator}H${statusDoor}z`}/*Door*/ />
      <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel7}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 7*/ />
      <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel7}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 7*/ />
      <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel6}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 6*/ />
      <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel6}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 6*/ />
      <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel5}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 5*/ />
      <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel5}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 5*/ />
      <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel4}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 4*/ />
      <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel4}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 4*/ />
      <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel3}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 3*/ />
      <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel3}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 3*/ />
      <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel2}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 2*/ />
      <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel2}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 2*/ />
      <Path fill="#C5E4F9" d={`M${door1PositionX} ${windowLevel1}h${widthDoorLevel1}v${heightDoorLevel1}H${door1PositionX}z`}/*Level 1*//>
      <Path fill="#C5E4F9" d={`M${door2PositionX} ${windowLevel1}h${widthDoorLevel1}v${heightDoorLevel1}H${door2PositionX}z`}/*Level 1*/ />
      <Path fill="#C5E4F9" d={`M${window1Level1PositionX} ${windowsLevel1PositionY}h${widthWindowLevel1}v${heightWindowLevel1}H${window1Level1PositionX}z`}/*Level 1*//>
      <Path fill="#C5E4F9" d={`M${window2Level1PositionX} ${windowsLevel1PositionY}h${widthWindowLevel1}v${heightWindowLevel1}H${window2Level1PositionX}z`}/*Level 1*//>
    </Svg>
  );
}

//Componente principal
export default function SimulationScreen () {

  const [recording, setRecording] = React.useState();//Variable y funcion para grabacion de un audio
  const [recordings, setRecordings] = React.useState([]);//Variable y funcion para grabaciones de audios
  const navigation = useNavigation(); //Permite hacer la navegacion para los iconos

  //Funcion para iniciar grabacion
  async function startRecording() {
    try {//Permisos de microfono
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        //Configuracion del audio
        const recordingOptions = {
          android: {
            extension: '.wav',
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WAV,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_ACC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: '.wav',
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        };
        const { recording } = await Audio.Recording.createAsync(recordingOptions);
        setRecording(recording);
      } else {
        console.error('No se acepto los permisos');
      }
    } catch (err) {
      console.error('Fallo en accesibilidad', err);
    }
  }

  //Detencion de grabacion
  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,//Evitar que IOS mande al cualquier reproduccion al auricular
      }
    );
    let updatedRecordings = [...recordings];
    //Nueva localizacion del archivo de audio
    const fileUri = `${FileSystem.documentDirectory}recording${Date.now()}.wav`;

    await FileSystem.copyAsync({
      from: recording.getURI(),
      to: fileUri,
    });

    const { sound} = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      file: fileUri,
    });
    
    setRecordings(updatedRecordings);//Actualizamos la lista de grabacione
    translateSpeechToText(fileUri);
    setRecordings([]);//Limpiamos la lista de grabaciones
  }

  //Llamada al API de Open AI
  async function translateSpeechToText(fileUri) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'audio/x-wav',
        name: 'audio.wav',
      });
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'text');
      formData.append('language', 'es');
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer APIKEY',
        },
      });

      const resultSpeech = response.data;//Resultado del reconocimiento del API
      
      console.log(resultSpeech);//Resultado del reconocimiento del API en concola 

      //Comando para activar ir Ver simulacion por voz
      if (resultSpeech.includes("Simular")||resultSpeech.includes("simular")||resultSpeech.includes("SIMULAR")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        navigation.navigate("Simulations");
        Speech.speak('Comando Simular detectado');
      }
      //Comando para activar ir Programar por voz
      if (resultSpeech.includes("Programar")||resultSpeech.includes("programar")||resultSpeech.includes("PROGRAMAR")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        navigation.navigate("Coding");
        Speech.speak("Comando Programar detectado");
      }
      //Comando para activar ir Inicio por voz
      if (resultSpeech.includes("Casa")||resultSpeech.includes("casa")||resultSpeech.includes("CASA")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        navigation.navigate("Home");
        Speech.speak("Comando Inicio detectado");
      }

      //Comando para activar ir Ayuda de App por voz
      if (resultSpeech.includes("Tutorial")||resultSpeech.includes("tutorial")||resultSpeech.includes("TUTORIAL")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        navigation.navigate("HelpAppScreen")
        Speech.speak("Comando Tutorial detectado");
      }

      //Comando para activar ir Inicio por voz
      if (resultSpeech.includes("Sube")||resultSpeech.includes("sube")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        upNextLevelElevator();
      }

      if (resultSpeech.includes("Baja")||resultSpeech.includes("baja")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        downNextLevelElevator();
      }

      if (resultSpeech.includes("Abrir")||resultSpeech.includes("abrir")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        openDoor();
      }

      if (resultSpeech.includes("Cerrar")||resultSpeech.includes("cerrar")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        closeDoor();
      }

      if (resultSpeech.includes("Detener")||resultSpeech.includes("detener")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
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
        await playSound(require("../assets/audio/incorrectSound.mp3"),1);
        Speech.speak(`Comando'${resultSpeech}'no valido o posiblemente no lo detecte bien`);
      }
    } catch (error) {
      console.error('Fallo de transcripcion', {...error});
      Alert.alert("Error", "El reconocimiento de voz no es posible en Android o hubo un error externo.");
    }

    //Eliminamos el archivo del App
    try {
      await FileSystem.deleteAsync(fileUri);
    } catch (error) {
      console.error(`Error al eliminar el archivo ${fileUri}: ${error.message}`);
    }

  }

  const sectionBuildWidth = Dimensions.get("window").width // Ancho del area para los elementos
  const sectionBuildHeight = Dimensions.get("window").height * 0.7 // Alto del area para los elementos

  //Declaracion de variables para la posicion de los niveles del elevador
  const level7Elevator = sectionBuildHeight * 0.05; 
  const level6Elevator = sectionBuildHeight * 0.15;
  const level5Elevator = sectionBuildHeight * 0.25;
  const level4Elevator = sectionBuildHeight * 0.35;
  const level3Elevator = sectionBuildHeight * 0.45;
  const level2Elevator = sectionBuildHeight * 0.55;
  const level1Elevator = sectionBuildHeight * 0.75;

  //Arreglo de las variables de los niveles de elevador
  const levelsElevator = [level1Elevator,level2Elevator,level3Elevator,level4Elevator,level5Elevator,level6Elevator,level7Elevator];

  const doorOpen = sectionBuildWidth * 0.70;//Posicion de la puerta abierta
  const doorClose = sectionBuildWidth * 0.73;//Posicion de la puerta cerrada 
  
  const doorElevator = [doorOpen,doorClose];//Arreglo de las variables de la puerta
  
  const [currentLevelXElevator, setCurrentLevelXElevator] = useState(levelsElevator[0]);//Nivel Inicial del elevador
  const [currentDoorElevator, setCurrentDoorElevator] = useState(doorElevator[1]);//Posicion inicial de la puerta

  //Reproducir sonido para subir
  const upElevatorSound = async () => {
    try {
      const soundObject1 = new Audio.Sound();
      await soundObject1.loadAsync(require('../assets/audio/dtmf_2.wav'));
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

  //Reproducir sonido para bajar
  const downElevatorSound = async () => {
    try {
      const soundObject1 = new Audio.Sound();
      await soundObject1.loadAsync(require('../assets/audio/dtmf_1.wav'));
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

  //Reproducir sonido para abrir
  const openDoorSound = async () => {
    try {
      const soundObject1 = new Audio.Sound();
      await soundObject1.loadAsync(require('../assets/audio/dtmf_8.wav'));
      await soundObject1.playAsync();
  
      // Esperamos 400 ms
      await new Promise(resolve => setTimeout(resolve, 400));
  
      const soundObject2 = new Audio.Sound();
      await soundObject2.loadAsync(require('../assets/audio/dtmf_3.wav'));
      await soundObject2.playAsync();
    } catch (error) {
      console.error('Error reproduciendo el sonido:', error);
    }
  };

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

  //Funcion para cerrar puerta
  function closeDoor () {
    if (currentDoorElevator === doorElevator[1]) {
      Alert.alert("Puerta cerrada","No se puede cerrar la puerta");
    } else {
      console.log("Cerrando puertas");
      setCurrentDoorElevator(doorElevator[1]);
      console.log("Deteniendo puertas");
      closeDoorSound();
    }
  };

  //Funcion para abrir puerta
  function openDoor() {
    if (currentDoorElevator === doorElevator[0]) {
      Alert.alert("Puerta abierta","No se puede abrir la puerta");
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
      Alert.alert("Puerta abierta","No se puede subir con la puerta abierta");
    } else {
      setCurrentLevelXElevator(prevLevel => {
        const currentIndex = levelsElevator.indexOf(prevLevel);
        if (currentIndex < levelsElevator.length - 1) {
          const nextLevel = levelsElevator[currentIndex + 1];
          console.log(`Subiendo al nivel ${levelsElevator.indexOf(nextLevel) + 1}`);
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
  function downNextLevelElevator () {
    if (currentDoorElevator === doorElevator[0]) {
      Alert.alert("Puerta abierta","No se puede bajar con la puerta abierta");
    } else {
      setCurrentLevelXElevator(prevLevel => {
        const currentIndex = levelsElevator.indexOf(prevLevel);
        if (currentIndex > 0) {
          const nextLevel = levelsElevator[currentIndex - 1];
          console.log(`Bajando al nivel ${levelsElevator.indexOf(nextLevel) + 1}`);
          downElevatorSound();
          return nextLevel;
        } else {
          Alert.alert("Nivel Minimo","Ya no se puede bajar más");
          return prevLevel;
        }
      });
    }
  };

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

  return (
    <View style={styles.maincontainer}>
      <View style={[styles.containerSVG, { flex: 1.5, backgroundColor: "#56D0F6" }]}>
        <SVGTop/>
      </View> 

      <View style={[styles.sectionforIcons, { flex: 1,flexDirection:'row'}]}>

        <View style={{flex: 1,  alignItems:"center", justifyContent:"center"}}>
          <AntDesign name="caretup" size={30} color="black" onPress={upNextLevelElevator} />
          <Text style={styles.textScreen}>Subir</Text>
        </View>
        
        <View style={{flex: 1,  alignItems:"center", justifyContent:"center"}}>
          <AntDesign name="caretdown" size={30} color="black" onPress={downNextLevelElevator}/>
          <Text style={styles.textScreen}>Bajar</Text>
        </View>

        <TouchableOpacity style={{flex: 1,  flexDirection: 'column', alignItems: 'center'}} onPress={openDoor}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign name="stepbackward" size={30} color="black" />
            <AntDesign name="stepforward" size={30} color="black" />
          </View>
          <Text style={styles.textScreen}>Abrir</Text>
        </TouchableOpacity>


        <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'center'}} onPress={closeDoor}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign name="stepforward" size={30} color="black" />
            <AntDesign name="stepbackward" size={30} color="black" />
          </View>
          <Text style={styles.textScreen}>Cerrar</Text>
        </TouchableOpacity>

        <View style={{flex: 1,  alignItems:"center", justifyContent:"center"}}>
          <FontAwesome name="stop" size={30} color="black" onPress={stopSound} />
          <Text style={styles.textScreen}>Detener</Text>
        </View>
        
      </View>
      
      <View style={[styles.sectionforElementsSimulations, { flex: 9, marginLeft:10}]}>
        <SVGSimulation 
          pathWidth={sectionBuildWidth} 
          pathHeight={sectionBuildHeight} 
          levelXElevator={currentLevelXElevator} 
          statusDoor={currentDoorElevator} 
          />
      </View>

      <TouchableOpacity style={styles.recordButtonContainer }>
        <FontAwesome5 name={recording ?"microphone-slash":"microphone"} 
          size={35} color="#f0ffff" 
          onPress={recording ? stopRecording : startRecording}/>
      </TouchableOpacity>

    </View>
  );
};

//Estilos
const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  containerSVG: { 
    width: "100%",
    alignItems: "center",
  },
  sectionforIcons: {
    width: "100%",
  },
  sectionforElementsSimulations: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: "90%",
  },
  recordButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor:'#00bfff',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textScreen:{
    fontSize: Platform.OS === 'android' ? 10 : 15,
  }
});
