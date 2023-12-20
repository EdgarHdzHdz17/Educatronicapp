import React, { useState, Component} from "react";
import {View,Text,Image,Modal,Pressable,ScrollView,TouchableOpacity,Alert} from "react-native";
import { FontAwesome5, AntDesign} from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import * as Speech from "expo-speech";
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import SVGTopHome from "../components/SVGTopHome";
import styles from "../styles/HomeStyles";
import playSound from "../functions/playSound";

//Hooks, variables o constantes 
const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);//Controlar la visibilidad de un componente modal
  const [recording, setRecording] = useState();//Variable y funcion para grabacion de un audio
  const [recordings, setRecordings] = useState([]);//Variable y funcion para grabaciones de audios
  const navigation = useNavigation(); //Permite hacer la navegacion para los iconos

  //Funcion para iniciar grabacion
  async function startRecording() {
    try {//Permisos de microfono
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          interruptionModeIOS: 0,
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
        allowsRecordingIOS: false,//Evitar que IOS mande la reproduccion al auricular
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
    setRecordings(updatedRecordings);//Actualizamos la lista de grabaciones
    translateSpeechToText(fileUri);//Una vez que se termina de grabar se manda a llamar el API
    setRecordings([]);//Limpiamos la lista de grabaciones
  }

  //Llamada al API de Open AI pasando como argumento la localizacion del audio grabado
  async function translateSpeechToText(fileUri) {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'audio/x-wav',
        name: 'audio.wav',
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

      const resultSpeech = response.data;//Resultado del reconocimiento del API
      
      console.log(resultSpeech);//Resultado del reconocimiento del API en concola 
      //Comandos solo para navegacion

      //Comando para activar ir Ver simulacion por voz
      if (resultSpeech.includes("Simular")||resultSpeech.includes("simular")||resultSpeech.includes("SIMULAR")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        navigation.navigate("Simulations");
        Speech.speak("Comando Simular detectado");
      }
      //Comando para activar ir Programar por voz
      if (resultSpeech.includes("Programar")||resultSpeech.includes("programar")||resultSpeech.includes("PROGRAMAR")) {
        await playSound(require("../assets/audio/soundCorrect.mp3"),1);
        navigation.navigate("Coding");
        Speech.speak("Comando Programar detectado");
      }
      //Comando para activar ir Inicio por voz
      if (resultSpeech.includes("Casa")||resultSpeech.includes("casa"||resultSpeech.includes("CASA"))) {
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

      if (
        !resultSpeech.includes("simular") &&
        !resultSpeech.includes("Simular") &&
        !resultSpeech.includes("SIMULAR") &&
        !resultSpeech.includes("programar") &&
        !resultSpeech.includes("Programar") &&
        !resultSpeech.includes("PROGRAMAR") &&
        !resultSpeech.includes("casa") &&
        !resultSpeech.includes("Casa") &&
        !resultSpeech.includes("CASA") &&
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
      console.log(`El archivo ${fileUri} se ha eliminado correctamente.`);
    } catch (error) {
      console.error(`Error al eliminar el archivo ${fileUri}: ${error.message}`);
    }

  }

  return (
    <View style={styles.maincontainer}>
      <View style={[styles.containerSVG, { flex: 1.5, backgroundColor: "#56D0F6" }]}>
        <SVGTopHome/>
      </View>

      <View style={[styles.sectionHeader, { backgroundColor: "#56D0F6", flex: 1 }]}>
        <Text style={styles.headerText}>EDUCATRONICAPP</Text>
        <FontAwesome5 style={styles.IconInfoApp} name="info-circle" size={35} color="black"onPress={() => setModalVisible(true)}/>
      </View>

      <View style={[styles.sectionImageBackGround, { flex: 8}]}>
        <Modal alignItems="center" animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { Alert.alert("Modal cerrado.");
          setModalVisible(!modalVisible);}}>
            <View style={styles.modalView}>
              <ScrollView>
                <Text style={styles.modalText}>
                {"\n"}APLICACION DESARROLLADA EN:{"\n"}EXPO REACT NATIVE
                </Text>
                <View style={{flexDirection: "row",justifyContent: "center",alignItems: "center", width: "100%",}}>
                  <Icon name="logo-apple-appstore" size={40} color="black"></Icon>
                  <Icon name="logo-react" size={40} color="black"></Icon>
                  <Icon name="logo-google-playstore" size={40} color="black"></Icon>
                </View>

                <Text style={styles.modalText}>
                {"\n"}DESARROLLADOR:{"\n"}Edgar Hernández Hernández{"\n"}email:edgarhdzhdz17@hotmail.com
                </Text>
                <Text style={styles.modalText}>
                RESPONSABLES DEL PROYECTO EDUCATRONICA:{"\n"}Dr.Enrique Ruiz Velazco Sánchez
                {"\n"}Dra.Josefina Barcenas López{"\n"}M. en C.Victor Hugo Garcia Ortega
                </Text>

                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Image source={require("../assets/Images/UNAM.png")}style={styles.image}resizeMode="contain"/>
                </View>

                <Text style={styles.modalText}>
                {"\n"}UNIVERSIDAD NACIONAL AUTONOMA DE MEXICO
                </Text>
                <Text style={styles.modalText}>{"\n"}Version: 2.5.5</Text>

                <Pressable style={styles.buttonCloseModal} onPress={() => setModalVisible(!modalVisible)}>
                  <AntDesign name="closecircle" size={30} color="black" />
                </Pressable>
              </ScrollView>
            </View>
        </Modal>

        <TouchableOpacity  style={styles.touchableContainer} onPress={() => navigation.navigate("HelpAppScreen")}>
          <LottieView
            source={require('../assets/LottiesFiles/edurobot.json')}
            autoPlay 
            loop 
            style={{width: 350,height: 350,}}
            />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.recordButtonContainer }>
        <FontAwesome5 name={recording ?"microphone-slash":"microphone"} size={35} color="#f0ffff" onPress={recording ? stopRecording : startRecording}/>
      </TouchableOpacity>
    </View>
  );
};

export default class App extends Component {
  
  //Mensaje cada que inicia el app
  textToSpeak =
    '¡Hola! Soy Edu, tu asistente de voz,si quieres ayuda presiona el robot';

  componentDidMount() {
    this.speakText();
  }

  //Configuracion de audio
  speakText = async () => {
    try {
      await Speech.speak(this.textToSpeak, { language: "es-Mx",voice: 'com.apple.ttsbundle.Paulina-compact'});
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return <HomeScreen/>;
  }
}


