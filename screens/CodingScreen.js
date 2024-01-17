import React, { useState,useRef } from "react";
import {View, Text,TextInput, Modal, Pressable, Alert,TouchableOpacity,Dimensions,Platform} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {FontAwesome,FontAwesome5,MaterialIcons,MaterialCommunityIcons,AntDesign} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import SVGTop from '../components/SVGTop';
import SVGSimulation from "../components/SVGSimulation";
import styles from "../styles/CodingStyles";
import playSound from "../functions/playSound";
import { levelsElevator, doorElevator,} from '../functions/elevatorConstants';

//Componente principal
export default function CodingScreen () {
  const [nameProgram, setNameProgram] = useState(""); //Variables para ingresar texto en el ProgramName
  const [inputTextCoding, setInputTextCoding] = useState(""); //Variables para ingresar texto
  const [isValid, setIsValid] = useState(false); //Variables para saber si el comando es correcto
  const [isValidCoding, setIsValidCoding] = useState(false); //Variables para saber si todo es automata es correcto
  const [result, setResult] = useState("Ingresa tus comandos"); //Variable para saber cual es el resultado despues de cada estado
  const [resultVerific, setResultVerific] = useState("Comienza tu programa"); //Variable para saber cual es el resultado despues de cada estado
  const navigation = useNavigation(); //Permite hacer la navegacion para los iconos
  const [modalVisible, setModalVisible] = useState(false); //Variable para ver modal
  const [programsSaveds, setProgramsSaveds] = useState([]); //Variable para programas guardados
  const [recording, setRecording] = useState(); //Variable y funcion para grabacion de un audio
  const [recordings, setRecordings] = useState([]); //Variable y funcion para grabaciones de audios
  const inputRefCoding = useRef(); //Varible que apunta al inputTextCoding
  const inputRefName = useRef(); //Varible que apunta al inputTextName
  const [programSelect, setProgramSelect] = useState(null); //Varible de programa seleccionado en el modal
  const [selectedFloor, setSelectedFloor] = useState(1);//Variable de piso seleccionado
  const [modalVisibleSimulation, setModalVisibleSimulation] = useState(false); //Variable para ver modal
  const [iconCompile, setIconCompile] = useState('play-circle');//Icono que cambia cuando esta compilando
  const [isButtonDisabled, setButtonDisabled] = useState(false);//Se desabilita el boton compilar durante la compilacion
  const [compilationInProgress, setCompilationInProgress] = useState(false);//Estado de compilacion
  const sectionBuildWidth = Dimensions.get("window").width // Ancho del area para los elementos
  const sectionBuildHeight = Dimensions.get("window").height * 0.7 // Alto del area para los elementos  
  const [currentLevelXElevator, setCurrentLevelXElevator] = useState(levelsElevator[0]);//Nivel inicial del elevador
  const [currentDoorElevator, setCurrentDoorElevator] = useState(doorElevator[1]);//Posicion inicial de la puerta

  //Funcion para cerrar puerta
  function closeDoor () {
    setCurrentDoorElevator(doorElevator[1])
  };

  //Funcion para abrir puerta
  function openDoor (){
    setCurrentDoorElevator(doorElevator[0])
  }

  //Funcion para recorrer el elevador de 1 en 1 para subir
  function upNextLevelElevator() {
    setCurrentLevelXElevator(prevLevel => {
      const currentIndex = levelsElevator.indexOf(prevLevel); // Obtiene el índice del nivel actual en el arreglo de niveles del elevador
      if (currentIndex < levelsElevator.length - 1) {// Verificamos si no estamos en el último nivel
        const nextLevel = levelsElevator[currentIndex + 1]; //Recorre el siguiene nivel
        return nextLevel;// Devolvemos el siguiente nivel
      } else {
        Alert.alert("Nivel Máximo", "Ya no se puede subir más");
        return prevLevel; //Devuelve el nivel 7
      }
    });
  }

  //Funcion para recorrer el elevador de 1 en 1 para bajar
  function downNextLevelElevator () {
    setCurrentLevelXElevator(prevLevel => {
      const currentIndex = levelsElevator.indexOf(prevLevel); // Obtiene el índice del nivel actual en el arreglo de niveles del elevador
      if (currentIndex > 0) {// Verificamos si no estamos en el último nivel
        const nextLevel = levelsElevator[currentIndex - 1];//Recorre el siguiene nivel
        return nextLevel;// Devolvemos el siguiente nivel
      } else {
        Alert.alert("Nivel Minimo","Ya no se puede bajar más");
        return prevLevel; //Devuelve el nivel 1
      }
    });
  };

  //Funcion para iniciar grabacion
  async function startRecording() {
    try {//Permisos de microfono
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
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
        const { recording } = await Audio.Recording.createAsync(recordingOptions);
        setRecording(recording);
      } else {
        console.error('No se acepto los permisos');
      }
    } catch (err) {
      console.error("Fallo en accesibilidad", err);
    }
  }

  //Detencion de grabacion
  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
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
    setRecordings(updatedRecordings);//Actualizamos la lista de grabacione
    translateSpeechToText(fileUri);
    setRecordings([]);//Limpiamos la lista de grabaciones
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
      formData.append('language', 'es');
      const response = await axios.post("https://api.openai.com/v1/audio/transcriptions",formData,{
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization":"Bearer APIKEY",
        },
      });

      const resultSpeech = response.data; //Resultado del reconocimiento del API

      console.log(resultSpeech); //Resultado del reconocimiento del API en concola

      //Creacion de diccionario de palabras
      const modifiedResultSpeech = resultSpeech
        .replace(/Inicio|inicio|INICIO/g, "I") // Reemplazar alguna opcion de Subir por "I"
        .replace(/Fin|fin|FIN/g, "F") // Reemplazar alguna opcion de Bajar por "F"
        .replace(/Enter|enter|ENTER/g, "\n") // Reemplazar alguna opcion de Bajar por "\n"
        .replace(/Sube|sube|suve|Suve|SUBE|SUVE/g, "S") // Reemplazar alguna opcion de Subir por "S"
        .replace(/Baja|baja|vaja|Vaja|BAJA|VAJA/g, "B") // Reemplazar alguna opcion de Bajar por "B"
        .replace(/Para|para|PARA/g, "P") // Reemplazar alguna opcion de Bajar por "P"
        .replace(/Abrir|abrir|ABRIR/g, "A") // Reemplazar alguna opcion de Bajar por "B"

        .replace(/,/g, "") // Reemplazar "," por ""

        .replace(/\./g, "") // Reemplazar "." por ""

        .replace(/Código|código|CÓDIGO/g, "") //Reemplaza el comando "Codigo" por ""
        .replace(/Nombre|nombre|NOMBRE/g, "") //Reemplaza el comando "Nombre" por ""

        .replace(/Uno|uno|UNO/g, "1") // Reemplazar alguna opcion de Subir por "1"
        .replace(/Dos|dos|DOS/g, "2") // Reemplazar alguna opcion de Subir por "2"
        .replace(/Tres|tres|TRES/g, "3") // Reemplazar alguna opcion de Subir por "3"
        .replace(/Cuatro|cuatro|CUATRO/g, "4") // Reemplazar alguna opcion de Subir por "4"
        .replace(/Cinco|cinco|CINCO/g, "5") // Reemplazar alguna opcion de Subir por "5"
        .replace(/Seis|seis|SEIS/g, "6") // Reemplazar alguna opcion de Subir por "6"
        .replace(/Siete|siete|SIETE/g, "7") // Reemplazar alguna opcion de Subir por "7"
        .replace(/Ocho|ocho|OCHO/g, "8") // Reemplazar alguna opcion de Subir por "8"
        .replace(/Nueve|nueve|NUEVE/g, "9"); // Reemplazar alguna opcion de Subir por "9"


      //Comando para activar el dictado dentro del inputTextCoding
      if (resultSpeech.includes("fin")||resultSpeech.includes("Fin")||resultSpeech.includes("FIN")) {
        setIsValidCoding(true);
      }

      //Comando para activar el dictado dentro del inputTextCoding
      if (resultSpeech.includes("código") || resultSpeech.includes("Código") || resultSpeech.includes("CÓDIGO")) {
        setInputTextCoding(modifiedResultSpeech);
        inputRefCoding.current.focus();
      }

      //Comando para activar el dictado dentro del nameProgram
      if (resultSpeech.includes("nombre") || resultSpeech.includes("Nombre") || resultSpeech.includes("NOMBRE")) {
        setNameProgram(modifiedResultSpeech);
        inputRefName.current.focus();
      }

      //Comando para activar ir Ayuda por voz
      if (resultSpeech.includes("ayuda") || resultSpeech.includes("Ayuda") || resultSpeech.includes("AYUDA")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        navigation.navigate("HelpCodingScreen");
        Speech.speak("Comando ver ayuda detectado");
      }

      //Compilar
      if (!compilationInProgress) {
        if (resultSpeech.includes("compilar") || resultSpeech.includes("Compilar") || resultSpeech.includes("COMPILAR")) {
          await playSound(require("../assets/audio/soundCorrect.mp3"),1);
          Speech.speak("Comando compilar detectado");
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Esperamos 1 segundo
          setCompilationInProgress(true); // Establece que la compilación está en progreso
          usedElevator(selectedFloor);
        }
      } else {
        Speech.speak("La compilación ya está en progreso");
      }

      //Guardar
      if (resultSpeech.includes("guardar") || resultSpeech.includes("Guardar") || resultSpeech.includes("GUARDAR")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        saveProgram()
        Speech.speak("Comando guardar detectado");
      }

      //Comando para piso 7
      if (resultSpeech.includes("Piso 7") || resultSpeech.includes("piso 7") || resultSpeech.includes("PISO 7") || resultSpeech.includes("PISO SIETE")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        setSelectedFloor(7)
        setCurrentLevelXElevator(levelsElevator[6])
        Speech.speak("Comando detectado");
      }

      //Comando para piso 6
      if (resultSpeech.includes("Piso 6") || resultSpeech.includes("piso 6") || resultSpeech.includes("PISO 6") || resultSpeech.includes("PISO SEIS")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        setSelectedFloor(6)
        setCurrentLevelXElevator(levelsElevator[5])
        Speech.speak("Comando detectado");
      }

      //Comando para piso 5
      if (resultSpeech.includes("Piso 5") || resultSpeech.includes("piso 5") || resultSpeech.includes("PISO 5") || resultSpeech.includes("PISO CINCO")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        setSelectedFloor(5)
        setCurrentLevelXElevator(levelsElevator[4])
        Speech.speak("Comando detectado");
      }

      //Comando para piso 4
      if (resultSpeech.includes("Piso 4") || resultSpeech.includes("piso 4") || resultSpeech.includes("PISO 4") || resultSpeech.includes("PISO CUATRO")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        setSelectedFloor(4)
        setCurrentLevelXElevator(levelsElevator[3])
        Speech.speak("Comando detectado");
      }

      //Comando para piso 3
      if (resultSpeech.includes("Piso 3") || resultSpeech.includes("piso 3") || resultSpeech.includes("PISO 3") || resultSpeech.includes("PISO TRES")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        setSelectedFloor(3)
        setCurrentLevelXElevator(levelsElevator[2])
        Speech.speak("Comando detectado");
      }

      //Comando para piso 2
      if (resultSpeech.includes("Piso 2") || resultSpeech.includes("piso 2") || resultSpeech.includes("PISO 2") || resultSpeech.includes("PISO DOS")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        setSelectedFloor(2)
        setCurrentLevelXElevator(levelsElevator[1])
        Speech.speak("Comando detectado");
      }

      //Comando para piso 1
      if (resultSpeech.includes("Piso 1") || resultSpeech.includes("piso 1") || resultSpeech.includes("PISO 1") || resultSpeech.includes("PISO UNO")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        setSelectedFloor(1)
        setCurrentLevelXElevator(levelsElevator[0])
        Speech.speak("Comando detectado");
      }

      //Comando borrar
      if (resultSpeech.includes("borrar") || resultSpeech.includes("Borrar") || resultSpeech.includes("BORRAR")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        deletedProgram();
        Speech.speak("Comando borrar detectado");
      }

      //Comando para activar ir simulacion por voz
      if (resultSpeech.includes("simulación") || resultSpeech.includes("Simulación") || resultSpeech.includes("SIMULACIÓN")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        setModalVisibleSimulation(true); 
        Speech.speak("Comando ver simulacion detectado");
      }

      //Comando para activar ir Inicio por voz
      if (resultSpeech.includes("Casa")||resultSpeech.includes("casa")||resultSpeech.includes("CASA")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        navigation.navigate("Home");
        Speech.speak("Comando Inicio detectado");
      }

      //Comando para activar ir Ver simulacion por voz
      if (resultSpeech.includes("Simular")||resultSpeech.includes("simular")||resultSpeech.includes("SIMULAR")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        navigation.navigate("Simulations");
        Speech.speak('Comando Simular detectado');
      }

      //Comando para activar ir Ayuda de App por voz
      if (resultSpeech.includes("Tutorial")||resultSpeech.includes("tutorial")||resultSpeech.includes("TUTORIAL")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        navigation.navigate("HelpAppScreen")
        Speech.speak("Comando Tutorial detectado");
      }

      if (
        !resultSpeech.includes("Piso 7") &&
        !resultSpeech.includes("Piso 6") &&
        !resultSpeech.includes("Piso 5") &&
        !resultSpeech.includes("Piso 4") &&
        !resultSpeech.includes("Piso 3") &&
        !resultSpeech.includes("Piso 2") &&
        !resultSpeech.includes("Piso 1") &&
        !resultSpeech.includes("piso 7") &&
        !resultSpeech.includes("piso 6") &&
        !resultSpeech.includes("piso 5") &&
        !resultSpeech.includes("piso 4") &&
        !resultSpeech.includes("piso 3") &&
        !resultSpeech.includes("piso 2") &&
        !resultSpeech.includes("piso 1") &&
        !resultSpeech.includes("PISO 7") &&
        !resultSpeech.includes("PISO 6") &&
        !resultSpeech.includes("PISO 5") &&
        !resultSpeech.includes("PISO 4") &&
        !resultSpeech.includes("PISO 3") &&
        !resultSpeech.includes("PISO 2") &&
        !resultSpeech.includes("PISO 1") && 
        !resultSpeech.includes("PISO SIETE") &&
        !resultSpeech.includes("PISO SEIS") &&
        !resultSpeech.includes("PISO CINCO") &&
        !resultSpeech.includes("PISO CUATRO") &&
        !resultSpeech.includes("PISO TRES") &&
        !resultSpeech.includes("PISO DOS") &&
        !resultSpeech.includes("PISO UNO") && 
        !resultSpeech.includes("código") &&
        !resultSpeech.includes("Código") &&
        !resultSpeech.includes("CÓDIGO") &&
        !resultSpeech.includes("nombre") &&
        !resultSpeech.includes("Nombre") &&
        !resultSpeech.includes("NOMBRE") &&
        !resultSpeech.includes("ayuda") &&
        !resultSpeech.includes("Ayuda") &&
        !resultSpeech.includes("AYUDA") &&
        !resultSpeech.includes("compilar") &&
        !resultSpeech.includes("Compilar") &&
        !resultSpeech.includes("COMPILAR") &&
        !resultSpeech.includes("casa") &&
        !resultSpeech.includes("Casa") &&
        !resultSpeech.includes("CASA") &&
        !resultSpeech.includes("borrar") &&
        !resultSpeech.includes("Borrar") &&
        !resultSpeech.includes("BORRAR") &&
        !resultSpeech.includes("guardar") &&
        !resultSpeech.includes("Guardar") &&
        !resultSpeech.includes("GUARDAR") &&
        !resultSpeech.includes("simulación") &&
        !resultSpeech.includes("Simulación") &&
        !resultSpeech.includes("SIMULACIÓN") &&
        !resultSpeech.includes("simular") &&
        !resultSpeech.includes("Simular") &&
        !resultSpeech.includes("SIMULAR") &&
        !resultSpeech.includes("tutorial") &&
        !resultSpeech.includes("Tutorial") &&
        !resultSpeech.includes("TUTORIAL")
      ) {
        await playSound(require("../assets/audio/incorrectSound.mp3"),1);
        Speech.speak(`Comando'${resultSpeech}'no valido o posiblemente no lo detecte bien`);
      }
    } catch (error) {
      console.error("Fallo de transcripcion", { ...error });
      Alert.alert("Error", "El reconocimiento de voz no es posible en Android o hubo un error externo.");
    }

    //Eliminamos el archivo del App
    try {
      await FileSystem.deleteAsync(fileUri);
    } catch (error) {
      console.error(`Error al eliminar el archivo ${fileUri}: ${error.message}`);
    }

  }

  //Funcion para Guardar NombredePrograma y Codigo
  function saveProgram () {
    if (nameProgram === "") {
      Alert.alert("Falta nombre","Por favor, ingresa un nombre para el programa.");
    } else if (inputTextCoding === "") {
      Alert.alert("Falta Codigo", "Por favor, ingresa el codigo del programa.");
    } else {
      // Verificar si el programa ya existe en la lista
      const isDuplicate = programsSaveds.some((program) => program.nameProgram === nameProgram);
      if (isDuplicate) {
        Alert.alert("Nombre duplicado","Ya existe un programa con el mismo nombre. Por favor, ingresa un nombre diferente.");
      } else {
        const programfind = {
          nameProgram: nameProgram,
          inputTextCoding: inputTextCoding,
        };
        setProgramsSaveds([...programsSaveds, programfind]);
        Alert.alert("Programa guardado","El programa ha sido guardado exitosamente");
      }
    }
  };

  //Funcion para cargar NombredePrograma y Codigo desde el modal
  function selectProgram (nameProgramSelect) {
    const selectProgram = programsSaveds.find((program) => program.nameProgram === nameProgramSelect);
    if (selectProgram) {
      setNameProgram(selectProgram.nameProgram);
      setInputTextCoding(selectProgram.inputTextCoding);
      setModalVisible(false);
      setProgramSelect(selectProgram); // Establecer el programa seleccionado
      setResult("Necesito verificar tus comandos");
      setResultVerific("Da un espacio para verificar");
      setIsValidCoding(false);
      setSelectedFloor(1);
      setCurrentLevelXElevator(levelsElevator[0]);
      Alert.alert("Programa cargado","El programa ha sido cargado exitosamente");
    }
  };

  //Funcion para borrar el programa cargado desde el modal
  function deletedProgram() {
    if (!inputTextCoding && !nameProgram) {
      Alert.alert("Campos vacios", "Ingrese texto en los campos");
      return; // Salir de la función sin hacer el borrado
    }
    if (compilationInProgress === false) {
      if (programSelect === null) {
        Alert.alert("Campos restablecidos");
        setInputTextCoding("");
        setNameProgram("");
        setSelectedFloor(1);
        setCurrentLevelXElevator(levelsElevator[0]);
        setIsValidCoding(false);
        setResult("Comienza tu programa");
        setResultVerific("Ingresa tus comandos");
        return; // Salir de la función sin hacer el borrado
      } else {
        Alert.alert("Confirmar eliminación",`¿Estás seguro de que deseas eliminar el programa '${programSelect.nameProgram}'?`,
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: () => {
              setProgramsSaveds((prevPrograms) =>
                prevPrograms.filter((program) => program.nameProgram !== programSelect.nameProgram)
              );
              setInputTextCoding("");
              setNameProgram("");
              setSelectedFloor(1);
              setCurrentLevelXElevator(levelsElevator[0])
              setIsValidCoding(false)
              setResult("Comienza tu programa");
              setResultVerific("Ingresa tus comandos");
              Alert.alert("Programa Borrado", "El programa ha sido borrado exitosamente");
              setProgramSelect(null); // Reiniciar el programa seleccionado
            },
          },
        ]
        );
      }
    } else {
      Alert.alert("Compilacion en curso", "NO es posible borrar")
    }
  }

  //Automata para comando indivudual
  function automatonComands(input) {
    let currentState = 0; // El estado inicial es 0
    setResult("Ingresa tus comandos"); //El valor de result es NULL
    for (let i = 0; i < input.length; i++) {
      const char = input.charAt(i);
      switch (currentState) {
        case 0: // Estado 0
          if (char === "S" || char === "s") {
            currentState = 1; // Si char es S o s pasa al estado 1
            setResult("Comando Subir detectado");
          } else if (char === "B" || char === "b") {
            currentState = 1; //Si char es B o b pasa al estado 1
            setResult("Comando Bajar detectado");
          } else if (char === "P" || char === "p") {
            currentState = 3; //Si char es P o p pasa al estado 3
            setResult("Comando Parar detectado");
          } else if (char === "A" || char === "a") {
            currentState = 3; //Si char es A o a pasa al estado 3
            setResult("Comando Abrir detectado");
          } else if (char === "I" || char === "i") {
            currentState = 5; //Si char es I o i pasa al estado 5
            setResult("Comando Inicio detectado");
          } else if (char === "F" || char === "f") {
            currentState = 6; //Si char es F o f pasa al estado 6
            setResult("Comando Fin detectado");
          } else if (char === "\n") {
            setResult("Comando Enter detectado");
            continue; //Continua en el estado si hay espacios antes de cualquier caracter
          } else if (char === " ") {
            continue; //Continua en el estado si hay espacios antes de cualquier caracter
          } else {
            setResult(`Invalido: El símbolo '${char}' no pertenece al lenguaje de comandos`);
            return false; // Si no es invalido
          }
          break;
        case 1: // Estado 1
          if (char === " ") {
            currentState = 2; // Si hay un espacio o mas, pasa al estado 2
            setResult("Sintaxis valida");
          } else {
            setResult("Invalido: Debe haber un espacio despues del comando");
            return false; // Si no hay un espacio, el input es inválido
          }
          break;
        case 2: // Estado 2
          if (char > 0 && char < 7) {
            currentState = 5; // Si char es mayor a 0 y menor 7, pasar al estado 5
            setResult(`Piso '${char}' detectado`);
          } else if (char === " ") {
            continue; //Continua en el estado si hay espacios antes de elegir piso
          } else {
            setResult(`Invalido: El numero '${char}' no corresponde a un piso`);
            return false; // Si no hay un numero mayor y menor  de 0 a 8 regresa un invalido
          }
          break;
        case 3: // Estado 3
          if (char === " ") {
            currentState = 4; // Si hay un espacio o mas, pasa al estado 4
            setResult("Sintaxis valida");
          } else {
            setResult("Invalido: Debe haber un espacio despues del comando");
            return false; // Si no hay un espacio, el input es inválido
          }
          break;
        case 4: // Estado 4
          if (char > 0 && char < 10) {
            currentState = 5; // Si char es mayor a 0 y menor que 10, pasa al estado 5
            setResult(`Tiempo '${char}' detectado`);
          } else if (char === " ") {
            continue; //Continua en el estado si hay espacios antesde elegir el tiempo
          } else {
            setResult(`Invalido tiempo '${char}' NO valido`);
            return false; // Si no hay un numero mayor de 0 y menor que 10 regresa un invalido
          }
          break;
        case 5: // Estado 5
          if (char === "\n") {
            setResult("Sintaxis valida");
            currentState = 0; // Si char es un enter pasa al estado 0
          } else if (char === " ") {
            setResult("Sintaxis valida");
            continue; //Continua en el estado si hay espacios antes de dar enter
          } else {
            setResult("Invalido: Debe haber un enter");
            return false; // Si no hay salto de linea el input es invalido
          }
          break;
        case 6: // Estado 6
          if (char === "\n") {
            setResult("Sintaxis valida");
          } else if (char === " ") {
            setResult("Sintaxis valida");
            continue; //Continua en el estado si hay espacios antes de dar enter
          } else {
            setResult("Sintaxis invalida");
            return false; // Si no hay salto de linea el input es invalido
          }
          break;
      }
    }
  }

  //Automata para verificar la estructura del codigo
  function automatonCoding(input) {
    let currentState = 0; // El estado inicial es 0
    setResultVerific("Comienza tu programa"); //El valor de result es NULL
    for (let i = 0; i < input.length; i++) {
      const char = input.charAt(i);
      switch (currentState) {
        case 0: // Estado 0
          if (char === "I" || char === "i") {
            currentState = 1; // Forzamos a que nuestro primer estado sea I o i, si es asi va al estado 1
            setResultVerific("Tu código va por buen camino");
          } else if (char === " ") {
            continue; //Continua en el estado si hay espacios antes de I o i
          } else {
            setResultVerific("Debes iniciar con el comando I o i");
            return false; // Si no es invalido
          }
          break;
        case 1: // Estado 1
          if (char === "\n") {
            currentState = 2; // Si hay un espacio o mas, pasa al estado 2
            setResultVerific("Tu código va por buen camino");
          } else if (char === " ") {
            continue; //Continua en el estado si hay espacios antes de un enter
          } else {
            setResultVerific("Tu código tiene errores");
            return false; // Si no hay un enter, el input es inválido y mencina el error del Automata para los comandos
          }
          break;
        case 2: // Estado 2
          if (char === "\n") {
          continue; // Permite más saltos de línea sin cambiar de estado
          } else if (char === "S" || char === "s" || char === "B" || char === "b") {
          currentState = 3; // Si char es S,s o B,b pasa al estado 3
          setResultVerific("Tu código va por buen camino");
          } else if (char === "P" || char === "p" || char === "A" ||char === "a") {
            currentState = 4; //Si char es A,a o P,p pasa al estado 4
          } else if (char === "I" || char === "i") {
            setResultVerific("Error ya haz colacado un comando Inicio");
          } else if (char === " ") {
            continue; //Continua en el estado si hay espacios antes de S,s,B,b,P,p,A,a
          } else {
            setResultVerific("Tu código tiene errores");
            return false; // Si no es invalido
          }
          break;
        case 3: // Estado 3
          if (char === " ") {
            currentState = 5; // Si hay un espacio o mas, pasa al estado 5
          } else {
            setResultVerific("Tu código tiene errores");
            return false; // Si no hay un espacio, el input es inválido
          }
          break;
        case 4: // Estado 4
          if (char === " ") {
            currentState = 6; // Si hay un espacio o mas, pasa al estado 6
          } else {
            setResultVerific("Tu código tiene errores");
            return false; // Si no hay un espacio, el input es inválido
          }
          break;
        case 5: // Estado 5
          if (char > 0 && char < 7) {
            currentState = 7; // Si char es mayor a 0 y menor 8, pasar al estado 7
            setResultVerific("Tu código va por buen camino");
          } else if (char === " ") {
            continue; //Continua en el estado si hay espacios antes de elegir piso
          } else {
            setResultVerific("Tu código tiene errores");
            return false; // Si no hay un numero mayor y menor  de 0 a 8 regresa un invalido
          }
          break;
        case 6: // Estado 6
          if (char > 0 && char < 10) {
            currentState = 7; // Si char es mayor a 0 y menor a 10, pasar al estado 7
            setResultVerific("Tu código va por buen camino");
          } else if (char === " ") {
            continue; //Continua en el estado si hay espacios antesde elegir el tiempo
          } else {
            setResultVerific("Tu código tiene errores");
            return false; // Si no hay un numero mayor y menor  de 0 a 8 regresa un invalido
          }
          break;
        case 7: // Estado 7
          if (char === "\n") {
            currentState = 8; // Si char es un enter pasa al estado 8 si es que continua ingresando comandos
          } else if (char === " ") {
            continue; //Continua en el estado si hay espacios antes de dar enter
          } else {
            setResultVerific("Tu código tiene errores");
            return false; // Si no hay salto de linea el input es invalido
          }
          break;
        case 8: // Estado 8
        if (char === "\n") {
          continue; // Permite más saltos de línea sin cambiar de estado
          } else if (char === "F" || char === "f") {
          currentState = 9; // Si char es un enter pasa al estado 9
          setResultVerific("La estructura de tu código es correcta");
          } else if (char === " ") {
            continue; //Continua en el estado 8 si hay espacios antes de F
          } else if (char === "S" || char === "s" || char === "B" ||char === "b") {
            currentState = 3; //Si char es A,a o P,p pasa al estado 3
          } else if (char === "P" || char === "p" || char === "A" ||char === "a") {
            currentState = 4; //Si char es A,a o P,p pasa al estado 4
          } else if (char === "I" || char === "i") {
            setResultVerific("Error ya tienes un comando Inicio");
          } else {
            setResultVerific("Debes terminar con F o f");
            return false; // Si hay otro caracter el input es invalido
          }
          break;
        case 9: // Estado 9
          if (char === "\n") {
            currentState=9; // Si char es un enter pasa al estado 9
          } else if (char === " ") {
            continue; //Continua en el estado 9 si hay espacios antes del enter
          } else {
            setResultVerific("Error ya haz colocado un comando Fin");
            return false; // Si hay otro caracter el input es invalido
          }
          break;
      }
    }
    return currentState === 9; // El input es válido si se llegó al estado 9 al final
  }

  //Funcion para validar automata de comandos
  function checkAutomatonComand(text) {
    const isValid = automatonComands(text);
    setIsValid(isValid);
  }

  //Funcion para validar automata de estructura de codigo
  function checkAutomatonCoding(text) {
    const isValidCoding = automatonCoding(text);
    setIsValidCoding(isValidCoding);
  }

  //Funcion para usar elevador
  async function usedElevator(selectedFloor) {
    if (nameProgram === "") {
      Alert.alert("Falta nombre","Por favor, ingresa un nombre para el programa.");
    } else if (inputTextCoding === "") {
      Alert.alert("Falta Codigo", "Por favor, ingresa el codigo del programa.");
    } else {
      if (!isValidCoding) {
        Alert.alert("Error", "La compilacion NO es posible, tienes errores.");
        return;
      } else {
        console.log("----------Compilacion en proceso----------")
        setButtonDisabled(true);//Desabilitamos el boton compilar
        setCompilationInProgress(true);//Actulizamos el estado de que se esta compilando
        setIconCompile('clock-o');//Cambiamos el icono de compilar mientras se compila

        // Se reproduce el sonido según el valor de selectedFloor para subir al elevador(Robot) en el piso indicado
        if (selectedFloor !== 1) {
          console.log('Subiendo el elevador al piso...', selectedFloor)
          await playSound(require("../assets/audio/dtmf_2.wav"), selectedFloor);
        }

        let currentFloor = selectedFloor;
        console.log("Piso elegido:", selectedFloor);
        console.log("Piso actual:", currentFloor);
        console.log("Texto ingresado:\n", inputTextCoding);
        
        const floorMax = 7;
        const floorMin = 1;
        let numSeg;
        let i = 0;
        let numFloors;

        //Funcion que recorre todo el inputTextCoding para representar el sonido que corresponde a cada caracter
        while (i < inputTextCoding.length) {
          //Comando I
          if (inputTextCoding[i] === "I" || inputTextCoding[i] === "i") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Comando Inicio detectado");
            playSound(require("../assets/audio/dtmf_12.wav"), 1);
            i++;
            //Comando S
          } else if (inputTextCoding[i] === "S" || inputTextCoding[i] === "s") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            i++; // Avanzar al siguiente caracter después de la "S" o "s"
            while (inputTextCoding[i] === " ") {
              i++; // Saltar los espacios en blanco
            }
            // Verificar si el siguiente caracter es un número
            if (!isNaN(inputTextCoding[i])) {
              numFloors = parseInt(inputTextCoding[i]);
              console.log("Comando Subir detectado, subiendo:",numFloors,"pisos");
              for (let j = 0; j < numFloors; j++) {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Esperamos 1 segundo
                if (currentFloor < floorMax) {
                  currentFloor++;
                  console.log("Subiendo a piso:", currentFloor);
                  setSelectedFloor(currentFloor);
                  upNextLevelElevator();
                  playSound(require("../assets/audio/dtmf_2.wav"), 1);
                } else {
                  console.log("El elevador no puede subir más. Límite de piso alcanzado:",floorMax);
                  Alert.alert("Piso maximo alcanzado ","Pasaremos al siguiente comando");
                  break; // Detenemos el bucle si el elevador alcanza el piso máximo
                }
              }
            } else {
              console.log("Comando Subir detectado, pero el siguiente caracter no es un número.");
            }
            //Comando B
          } else if (inputTextCoding[i] === "B" || inputTextCoding[i] === "b") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            i++; // Avanzar al siguiente caracter después de la "B" o "b"
            while (inputTextCoding[i] === " ") {
              i++; // Saltar los espacios en blanco
            }
            // Verificar si el siguiente caracter es un número
            if (!isNaN(inputTextCoding[i])) {
              numFloors = parseInt(inputTextCoding[i]);
              console.log("Comando Bajar detectado, bajando:",numFloors,"pisos");
              for (let j = 0; j < numFloors; j++) {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Esperamos 1 segundo
                if (currentFloor > floorMin) {
                  currentFloor--;
                  console.log("Bajando a piso:", currentFloor);
                  setSelectedFloor(currentFloor);
                  downNextLevelElevator();
                  playSound(require("../assets/audio/dtmf_1.wav"), 1); 
                } else {
                  console.log("El elevador no puede bajar más. Límite de piso alcanzado:",floorMin);
                  Alert.alert("Piso minimo alcanzado ","Pasaremos al siguiente comando");
                  break; // Detenemos el bucle si el elevador alcanza el piso minimo
                }
              }
            } else {
              console.log("Comando Bajar detectado, pero el siguiente caracter no es un número.");
            }
            //Comando F
          } else if (inputTextCoding[i] === "F" || inputTextCoding[i] === "f") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Comando Fin detectado");
            playSound(require("../assets/audio/dtmf_d.wav"), 1);
            i++; // Avanzar al siguiente caracter después de la "F" o "f"
            //Comando P
          } else if (inputTextCoding[i] === "P" || inputTextCoding[i] === "p") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            i++; // Avanzar al siguiente caracter después de la "P" o "p"
            while (inputTextCoding[i] === " ") {
              i++; // Saltar los espacios en blanco
            }
            // Verificar si el siguiente caracter es un número
            if (!isNaN(inputTextCoding[i])) {
              let segInicial = 0;
              numSeg = parseInt(inputTextCoding[i]);
              console.log("Comando Parar detectado, parando:",numSeg,"segundos");
              for (let j = 0; j < numSeg; j++) {
                segInicial++;
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Esperamos 1 segundo
                console.log("Pausa del:", segInicial, "segundo");
                playSound(require("../assets/audio/dtmf_3.wav"), 1);
              }
            } else {
              console.log("Comando Parar detectado, pero el siguiente caracter no es un número.");
            }
            //Comando A
          } else if (inputTextCoding[i] === "A" || inputTextCoding[i] === "a") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Comando Abrir detectado, abriendo puertas");
            playSound(require("../assets/audio/dtmf_8.wav"), 1);
            await new Promise((resolve) => setTimeout(resolve, 800));
            console.log("Deteniendo puertas");
            openDoor();
            playSound(require("../assets/audio/dtmf_3.wav"), 1);
            i++; // Avanzar al siguiente caracter después de la "A" o "a"
            while (inputTextCoding[i] === " ") {
              i++; // Saltar los espacios en blanco
            }
            // Verificar si el siguiente caracter es un número
            if (!isNaN(inputTextCoding[i])) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              let segInicial = 0;
              numSeg = parseInt(inputTextCoding[i]);
              console.log("Puerta abierta por:",numSeg,"segundos");
              for (let j = 0; j < numSeg; j++) {
                segInicial++;
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Esperamos 1 segundo
                console.log("Apertura del:", segInicial, "segundo");
                playSound(require("../assets/audio/dtmf_3.wav"), 1);
              }
            } else {
              console.log("Comando Abrir detectado, pero el siguiente caracter no es un número.");
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Cerrando puertas");
            playSound(require("../assets/audio/dtmf_4.wav"), 1);
            await new Promise((resolve) => setTimeout(resolve, 800));
            console.log("Deteniendo puertas");
            closeDoor();
            playSound(require("../assets/audio/dtmf_3.wav"), 1);
          }
          i++;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Piso final:", currentFloor); // Imprimimos el piso final
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Valores restablecidos"); //Reiniciamos todo
        Alert.alert("Programa terminado","Reiniciando el elevador")
        console.log("Bajando el elevador al piso... 1");
        setSelectedFloor(1);
        setCurrentLevelXElevator(levelsElevator[0])
        setIconCompile('play-circle');
        setButtonDisabled(false);
        setCompilationInProgress(false);
        console.log("----------Fin de la Compilacion----------");
      }
    }
  }

  return (
    <View style={styles.maincontainer}>
      <View style={[styles.containerSVG, { flex: 1.5, backgroundColor: "#56D0F6" }]}>
        <SVGTop />
      </View>

      <View style={[styles.sectionforName, { flex: 1 }]}>
      <TextInput
        style={[styles.programName]}
        ref={inputRefName}
        placeholder="Nombra tu programa aquí"
        value={nameProgram}
        onChangeText={(text) => {
          if (text.length <= 15) {
            setNameProgram(text);
          } else {
            Alert.alert('Advertencia', 'El nombre no puede superar los 15 caracteres');
          }
        }}
      ></TextInput>
      </View>

      <View style={[styles.sectionOfPrograms, { flex: 10 }]}>
        <View style={[styles.sectionforIcons, { flex: 1 }]}>
          <View style={[styles.Icons, { flex: 1 }]}>
            <Picker
              style={styles.picker}
              selectedValue={selectedFloor}
              mode="dropdown" // Opcion desplegable para android
              itemStyle={{ height: 50, fontSize: Platform.OS === 'android' ? 10 : 10, textAlign: "center",justifyContent: "center" }}
              onValueChange={(itemValue) => {
                setSelectedFloor(itemValue);
                const selectedLevel = levelsElevator[itemValue - 1]; // Resta 1 porque los valores de Picker comienzan desde 1
                setCurrentLevelXElevator(selectedLevel);
              }}
            >
              <Picker.Item label="1" value={1} />
              <Picker.Item label="2" value={2} />
              <Picker.Item label="3" value={3} />
              <Picker.Item label="4" value={4} />
              <Picker.Item label="5" value={5} />
              <Picker.Item label="6" value={6} />
              <Picker.Item label="7" value={7} />
            </Picker>
            <Text style={styles.textComand}>Piso: {selectedFloor}</Text>
          </View>

          <View style={[styles.Icons, { flex: 1 }]}>
            <FontAwesome
              name= {iconCompile}
              size={Platform.OS === 'android' ? 40 : 35}
              color="black"
              onPress={() => usedElevator(selectedFloor)}disabled={isButtonDisabled}           
            />
            <Text style={styles.textComand}>Compilar</Text>
          </View>

          <TouchableOpacity style={[styles.Icons, { flex: 1 }]}>
            <MaterialCommunityIcons
              name="usb-port"
              size={Platform.OS === 'android' ? 40 : 35}
              color="black"
              onPress={saveProgram}
            />
            <Text style={styles.textComand}>Guardar</Text>
          </TouchableOpacity>

          <View style={[styles.Icons, { flex: 1 }]}>
            <FontAwesome5
              name="file-upload"
              size={Platform.OS === 'android' ? 40 : 35}
              color="black"
              onPress={() => setModalVisible(true)}
            />
            <Text style={styles.textComand}>Cargar</Text>
            <Text style={styles.textComand}>Programa</Text>
          </View>

          <Modal
            visible={modalVisible}
            animationType="slide"
            alignItems="center"
            transparent={true}
            onDismiss={() => setModalVisible(false)}
          >
            <View style={styles.modalView}>
              <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 15, marginBottom: 10 }}>
                Tus Programas:
              </Text>
              {programsSaveds.map((program, index) => (
                <Text
                  key={index}
                  onPress={() => selectProgram(program.nameProgram)}
                  style={{
                    fontSize:20,
                    marginBottom:20,
                    padding: 5, // Espaciado interno para separar el texto del borde
                  }}
                >
                  {program.nameProgram}
                </Text>
              ))}

              <Pressable style={styles.buttonCloseModal} onPress={() => setModalVisible(!modalVisible)}>
                  <AntDesign name="closecircle" size={25} color="black" />
              </Pressable>
            </View>
          </Modal>

          <View style={[styles.Icons, { flex: 1 }]}>
            <MaterialIcons
              name="delete"
              size={Platform.OS === 'android' ? 40 : 35}
              color="black"
              onPress={() => {
                deletedProgram();
              }}
            />
            <Text style={styles.textComand}>Borrar</Text>
          </View>

          <View style={[styles.Icons, { flex: 1 }]}>
            <MaterialCommunityIcons
              name="gamepad-variant"
              size={Platform.OS === 'android' ? 40 : 35}
              color="black"
              onPress={() => {
                setModalVisibleSimulation(true)
              }}
            />
            <Text style={styles.textComand}>Ver</Text>
            <Text style={styles.textComand}>Simulación</Text>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleSimulation}
            onRequestClose={() => setModalVisibleSimulation(false)}
          >
            <View style={styles.maincontainer}>
              <View style={[styles.containerSVG, { flex: 1.5, backgroundColor: "#56D0F6" }]}>
                <SVGTop/>
              </View> 

              <View style={[styles.sectionforPicker, {flex: 1}]}>
                <Picker
                  style={styles.pickerSimulation}
                  selectedValue={selectedFloor}
                  mode="dropdown" // Opcion desplegable para android
                  itemStyle={{ height: 50, fontSize: 10, textAlign: "center",justifyContent: "center" }}
                  onValueChange={(itemValue) => {
                    setSelectedFloor(itemValue);
                    const selectedLevel = levelsElevator[itemValue - 1]; // Se resta 1 porque los valores de Picker comienzan desde 1
                    setCurrentLevelXElevator(selectedLevel);
                  }}
                >
                  <Picker.Item label="Piso 1" value={1} />
                  <Picker.Item label="Piso 2" value={2} />
                  <Picker.Item label="Piso 3" value={3} />
                  <Picker.Item label="Piso 4" value={4} />
                  <Picker.Item label="Piso 5" value={5} />
                  <Picker.Item label="Piso 6" value={6} />
                  <Picker.Item label="Piso 7" value={7} />
                </Picker>
              </View>
              
              <View style={[styles.sectionforElementsSimulations, { flex: 9, marginLeft:10}]}>
                <SVGSimulation pathWidth={sectionBuildWidth} 
                  pathHeight={sectionBuildHeight} 
                  levelXElevator={currentLevelXElevator} 
                  statusDoor={currentDoorElevator} />
              </View>

              <Pressable style={styles.buttonCloseModal} onPress={() => setModalVisibleSimulation(!modalVisibleSimulation)}>
                  <AntDesign name="closecircle" size={35} color="black" />
              </Pressable>
            </View>

            <TouchableOpacity style={styles.recordButtonContainer }>
                <FontAwesome5 name={recording ?"microphone-slash":"microphone"} 
                  size={35} color="#f0ffff" 
                  onPress={recording ? stopRecording : startRecording}disabled={isButtonDisabled} 
                  />
              </TouchableOpacity>
          </Modal>

          <View style={[styles.Icons, { flex: 1 }]}>
            <MaterialIcons
              name="help"
              size={Platform.OS === 'android' ? 40 : 35}
              color="black"
              onPress={() => navigation.navigate("HelpCodingScreen")} 
            />
            <Text style={styles.textComand}>Ayuda</Text>
          </View>
        </View>

        <View style={[styles.sectiontextProgram, { flex: 3 }]}>
          <Text style={styles.resultCheck}>
            {resultVerific}
            {"\n"}
          </Text>
          <Text style={styles.resultCommand}>{result}</Text>
          <Text style={styles.message}>
            {isValidCoding
              ? "La compilación es posible "
              : "La compilación aun es imposible"}
          </Text>

          <TextInput
            style={[styles.textCoding]}
            multiline={true} //Permite muchas lineas
            ref={inputRefCoding}
            value={inputTextCoding}
            textAlignVertical="top" //El cursor inicia hasta la parte de arriba
            placeholder="Escribe el codigo de tu programa aqui" //Leyenda del inputText
            onChangeText={(text) => {
              setInputTextCoding(text);
              checkAutomatonComand(text);
              checkAutomatonCoding(text);
            }}
            
          ></TextInput>

          <TouchableOpacity style={styles.recordButtonContainer}>
            <FontAwesome5
              name={recording ? "microphone-slash" : "microphone"}
              size={35}
              color="#f0ffff"
              onPress={recording ? stopRecording : startRecording}disabled={isButtonDisabled} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
