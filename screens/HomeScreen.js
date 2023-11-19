import React, { useState, Component} from "react";
import {View,Text,StyleSheet,Image,Modal,Pressable,ScrollView,TouchableOpacity,Alert,Platform} from "react-native";
import { FontAwesome5, AntDesign} from "@expo/vector-icons";
import Svg, { Path, Ellipse } from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";
import * as Speech from "expo-speech";
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';

//Hooks, variables o constantes 
const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);//Controlar la visibilidad de un componente modal
  const [recording, setRecording] = React.useState();//Variable y funcion para grabacion de un audio
  const [recordings, setRecordings] = React.useState([]);//Variable y funcion para grabaciones de audios
  const navigation = useNavigation(); //Permite hacer la navegacion para los iconos

  //Componente SVG Top
  function SVGTop() {
    return (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={321}
        height={70}
        fill="none"
      >
        <Path
          fill="#56D0F7"
          d="M0 25C0 11.193 11.193 0 25 0h271c13.807 0 25 11.193 25 25v53H0V25Z"
        />
        <Path
          fill="#56D0F7"
          d="M0 25C0 11.193 11.193 0 25 0h271c13.807 0 25 11.193 25 25v53H0V25Z"
        />
        <Path
          fill="#F9FCFF"
          fillRule="evenodd"
          d="M46.857 54.61a2.926 2.926 0 0 0 .05-2.043c-.74-2.16-3.854-3.387-6.954-2.738-1.757.368-3.133 1.26-3.86 2.357-1.17-.489-2.635-.64-4.098-.333-1.937.405-3.367 1.506-3.862 2.793a7.488 7.488 0 0 0-1.286.155c-2.835.593-4.583 2.676-3.905 4.653.678 1.976 3.526 3.098 6.36 2.505.942-.197 1.763-.558 2.415-1.025 1.255.89 3.166 1.266 5.072.867 1.067-.224 1.981-.658 2.67-1.22 1.26 1.335 3.662 1.978 6.056 1.477 3.03-.634 4.897-2.86 4.173-4.972-.391-1.14-1.457-2.013-2.831-2.477ZM159.249 30.454H125.78c-5.401 0-9.78-2.88-9.78-6.435 0-3.554 4.379-6.435 9.78-6.435 1.13 0 2.215.126 3.224.358 1.943-2.317 5.691-3.886 9.997-3.886 3.814 0 7.191 1.231 9.263 3.123.29-.016.583-.025.879-.025 3.655 0 6.858 1.278 8.632 3.19.477-.06.97-.091 1.474-.091 4.281 0 7.751 2.284 7.751 5.1 0 2.818-3.47 5.101-7.751 5.101Z"
          clipRule="evenodd"
        />
        <Path
          fill="#F9911E"
          d="M60.098 16.415c0 .362-.073.715-.213 1.055-.403.98-1.355 1.855-2.682 2.531-.64.327-1.369.608-2.164.832-.81.228-1.69.398-2.62.498a18.388 18.388 0 0 1-2.447.099c-1.818-.047-3.503-.356-4.92-.855-.443-.156-.86-.332-1.246-.523a8.367 8.367 0 0 1-1.157-.687c-1.152-.825-1.834-1.84-1.84-2.938l.001-.07.002-.056c0-.017.001-.034.003-.05.07-1.127.852-2.16 2.12-2.98.244-.158.505-.308.784-.45 1.228-.623 2.774-1.078 4.5-1.291a18.012 18.012 0 0 1 2.235-.136c1.665 0 3.231.22 4.598.607.415.117.812.25 1.188.397.364.142.707.297 1.028.464.157.082.31.166.455.254.696.415 1.264.89 1.668 1.408.456.584.707 1.222.707 1.89Z"
        />
        <Path
          fill="#F9A24B"
          d="M59.554 14.748c-1.556 1.08-3.491 2.241-5.706 3.394a67.213 67.213 0 0 1-6.576 2.992l-.038.015a14.689 14.689 0 0 1-1.865-.467l.037-.01.007-.003c2.111-.602 4.784-1.68 7.424-3.054 2.614-1.361 4.67-2.738 5.832-3.832.278.235.52.483.722.74.058.075.112.15.163.225Z"
        />
        <Path
          fill="#fff"
          d="M54.975 12.718a.485.485 0 0 1-.15-.022 12.234 12.234 0 0 0-1.044-.289c-.143-.033-.208-.12-.145-.194.063-.074.23-.108.373-.075.384.088.76.192 1.116.308.132.043.172.134.09.203a.391.391 0 0 1-.24.07ZM56.28 19.713a.437.437 0 0 1-.206-.046c-.107-.06-.101-.153.013-.208 1.66-.809 2.612-1.95 2.612-3.129 0-1.186-.913-2.29-2.573-3.11-.113-.055-.118-.149-.01-.208a.484.484 0 0 1 .399-.005c1.773.875 2.75 2.055 2.75 3.323 0 1.26-1.018 2.48-2.792 3.344a.45.45 0 0 1-.193.04ZM55.091 20.198a.396.396 0 0 1-.237-.067c-.085-.069-.048-.16.083-.204.144-.049.287-.1.425-.154.126-.048.303-.035.396.03.093.066.067.158-.059.206-.147.058-.3.113-.454.165a.485.485 0 0 1-.154.024Z"
        />
        <Path
          fill="#000"
          d="M57.268 12.862a10.492 10.492 0 0 0-1.028-.464c-.376-.147-.773-.28-1.188-.397a.301.301 0 0 0 .069.048c.599.311.286 1.042-.711 1.992-.002 0-.004.002-.005.004l-.035.033c-1.162 1.093-3.218 2.47-5.832 3.831-.46.239-.92.469-1.377.689-.464.223-1.212.146-1.475-.153-.56-.636-.874-1.344-.874-2.09 0-1.355 1.031-2.584 2.707-3.487.922-.498 2.04-.897 3.29-1.163a16.69 16.69 0 0 1 1.628-.26 18.336 18.336 0 0 0-2.02-.11c-1.291 0-2.523.131-3.648.37-1.25.266-2.368.665-3.29 1.163-1.676.903-2.707 2.132-2.707 3.487 0 1.453 1.187 2.762 3.082 3.678l-.048.02c.386.19.803.366 1.246.521l.06-.026c.647.223 1.347.405 2.09.542a18.353 18.353 0 0 0 5.234.175 16.878 16.878 0 0 1-1.194-.175 13.568 13.568 0 0 1-3.194-.983c-.516-.24-.517-.66-.013-.906.504-.247 1.01-.503 1.515-.765 2.214-1.153 4.15-2.314 5.705-3.394l.043-.03c.963-.67 1.78-1.31 2.425-1.896a8.445 8.445 0 0 0-.455-.254Z"
          opacity={0.25}
        />
        <Path
          fill="#F7DB9C"
          d="M63.28 9.745c-1.264-.658-5.037.16-9.552 1.918l-.04.02c.655.122 1.277.279 1.858.467l.048-.025c1.825-.52 3.228-.682 3.825-.37.6.311.286 1.042-.71 1.992-.002 0-.004.002-.005.003l-.035.033c-1.162 1.094-3.218 2.471-5.832 3.832-2.64 1.374-5.313 2.453-7.424 3.054l-.007.002-.037.01c-.446.127-.867.232-1.256.313-1.188.249-2.086.28-2.533.048-.594-.31-.29-1.03.69-1.97a4.827 4.827 0 0 1-.902-.97c-3.35 2.34-4.908 4.294-3.648 4.95.979.51 3.463.133 6.631-.879h.001c.91-.29 1.878-.634 2.882-1.024l.038-.015a67.19 67.19 0 0 0 6.576-2.992c2.215-1.153 4.15-2.314 5.706-3.394l.043-.03c3.375-2.35 4.947-4.315 3.683-4.973Z"
        />
        <Path
          fill="#333"
          d="M50.5 21.574c-1.144 0-2.264-.1-3.332-.298l.19-.277c1.006.186 2.063.28 3.142.28 5.17 0 9.377-2.19 9.377-4.88 0-.562-.182-1.112-.54-1.636l-.016-.024v-.026h.283l.266-.049c.38.556.572 1.14.572 1.734 0 2.854-4.46 5.176-9.942 5.176Z"
        />
        <Path
          fill="#333"
          d="M38.984 23.426c-.628 0-1.117-.09-1.464-.27-.706-.368-.693-1.044.039-2.01.667-.88 1.918-1.971 3.618-3.155l.452.176c-1.67 1.163-2.896 2.23-3.544 3.087-.624.823-.682 1.424-.165 1.694.517.269 1.672.238 3.253-.086 1.645-.338 3.695-.976 5.93-1.846a67.33 67.33 0 0 0 6.546-2.978c2.146-1.118 4.124-2.296 5.721-3.408 1.67-1.163 2.897-2.23 3.545-3.087.624-.823.682-1.424.165-1.694-.517-.269-1.672-.238-3.253.086-1.645.338-3.695.976-5.93 1.846l-.338-.236c2.274-.885 4.37-1.536 6.06-1.883 1.856-.381 3.155-.388 3.861-.02.706.367.693 1.043-.039 2.01-.667.88-1.918 1.97-3.618 3.154-1.613 1.123-3.61 2.313-5.775 3.44a68.001 68.001 0 0 1-6.607 3.006c-2.274.885-4.37 1.536-6.06 1.884-.945.193-1.745.29-2.397.29Zm3.479-2.08c-.463 0-.826-.066-1.083-.2-.68-.355-.451-1.104.664-2.166l.496.14c-.94.897-1.224 1.576-.76 1.818.465.242 1.77.094 3.49-.396l.063-.018c2.153-.619 4.81-1.715 7.304-3.013 2.512-1.308 4.631-2.703 5.816-3.828l.006-.006c.942-.897 1.226-1.576.76-1.818-.464-.242-1.769-.094-3.49.395l-.27-.258c2.04-.58 3.479-.7 4.16-.345.682.354.453 1.103-.661 2.164l-.006.006c-1.209 1.15-3.365 2.57-5.916 3.898-2.55 1.328-5.28 2.45-7.487 3.08h-.005l-.013.004h-.001c-1.268.361-2.303.543-3.067.543Z"
        />
        <Path
          fill="#DDBE7F"
          d="M38.988 22.748c-.262 0-.462-.026-.549-.071-.019-.01-.452-.252.33-1.283.423-.56 1.108-1.216 2.013-1.935-.717.9-.692 1.556.079 1.957.274.143.775.313 1.604.313.601 0 1.32-.09 2.148-.27-2.402.82-4.427 1.29-5.625 1.29Zm21.231-9.411c.717-.9.69-1.556-.08-1.957-.274-.142-.775-.313-1.604-.313-.6 0-1.32.09-2.146.27 2.401-.82 4.426-1.289 5.623-1.289.262 0 .462.026.549.072.019.01.452.252-.33 1.283-.423.559-1.107 1.215-2.012 1.934Z"
        />
        <Path
          fill="#333"
          d="m45.43 20.762-.244-.061c-1.282-.416-2.38-.988-3.177-1.654a4.93 4.93 0 0 1-.914-.988c-.377-.55-.568-1.13-.568-1.72 0-2.83 4.423-5.132 9.86-5.132 1.134 0 2.246.1 3.304.295.66.123 1.298.283 1.896.476 1.282.415 2.38.987 3.178 1.655l-.333.292-.147-.137c-.752-.63-1.788-1.169-2.997-1.56a14.29 14.29 0 0 0-1.786-.448 17.144 17.144 0 0 0-3.115-.279c-5.125 0-9.294 2.17-9.294 4.838 0 .557.18 1.103.535 1.622.221.325.511.638.86.93.749.626 1.78 1.164 2.983 1.556l.2.05-.241.265Z"
        />
        <Path
          fill="#FACE32"
          d="M183.788 63.452c0 3.244-5.677 5.874-12.681 5.874-7.003 0-12.681-2.63-12.681-5.874 0-3.244 5.678-5.874 12.681-5.874 7.004 0 12.681 2.63 12.681 5.874Z"
        />
        <Path
          fill="#FACE32"
          d="M206.049 64.466c0 3.244-5.678 5.874-12.681 5.874-7.004 0-12.682-2.63-12.682-5.874 0-3.244 5.678-5.873 12.682-5.873 7.003 0 12.681 2.63 12.681 5.873Z"
        />
        <Path
          fill="#FACE32"
          d="M214.624 60.41c0 2.17-3.798 3.93-8.484 3.93s-8.485-1.76-8.485-3.93 3.799-3.93 8.485-3.93 8.484 1.76 8.484 3.93ZM246.555 56.691c0 2.17-3.798 3.93-8.484 3.93s-8.485-1.76-8.485-3.93 3.799-3.93 8.485-3.93 8.484 1.76 8.484 3.93ZM296.106 61.8c-.842 2.395-5.758 4.018-10.979 3.624-5.222-.394-8.773-2.655-7.931-5.05.842-2.396 5.758-4.019 10.98-3.625 5.221.394 8.772 2.655 7.93 5.05ZM319.54 61.635c-.85 2.419-3.661 4.652-8.882 4.259-5.222-.394-8.766-2.674-7.916-5.093.85-2.418 5.772-4.06 10.994-3.666 5.222.394 6.654 2.081 5.804 4.5Z"
        />
        <Path
          fill="#FACE32"
          d="M305.913 63.352c-.559 1.59-3.794 2.668-7.225 2.41-3.432-.26-5.76-1.757-5.202-3.347.559-1.589 3.793-2.668 7.225-2.409 3.431.259 5.76 1.757 5.202 3.346ZM235.79 58.508c0 3.22-5.718 5.831-12.772 5.831s-12.773-2.61-12.773-5.831c0-3.22 5.719-5.831 12.773-5.831 7.054 0 12.772 2.61 12.772 5.831ZM284.463 57.582c-1.053 2.995-7.147 5.027-13.612 4.54-6.465-.488-10.853-3.31-9.8-6.305 1.052-2.995 7.147-5.027 13.612-4.54 6.465.488 10.852 3.31 9.8 6.305ZM162.623 66.917c0 1.89-3.268 3.423-7.299 3.423-4.031 0-7.298-1.533-7.298-3.423 0-1.89 3.267-3.423 7.298-3.423 4.031 0 7.299 1.533 7.299 3.423ZM129.779 74.185c0 1.89-3.308 3.423-7.389 3.423-4.082 0-7.39-1.533-7.39-3.423 0-1.89 3.308-3.423 7.39-3.423 4.081 0 7.389 1.533 7.389 3.423Z"
        />
        <Path
          fill="#FACE32"
          d="M140.18 74.185c0 1.89-3.268 3.423-7.299 3.423-4.031 0-7.298-1.533-7.298-3.423 0-1.89 3.267-3.423 7.298-3.423 4.031 0 7.299 1.533 7.299 3.423Z"
        />
        <Path
          fill="#FACE32"
          d="M157.983 71.039c1.789 2.061-1.156 4.55-6.578 5.56-5.422 1.009-11.268.156-13.056-1.905-1.789-2.062 1.156-4.551 6.578-5.56 5.422-1.01 11.268-.157 13.056 1.905ZM239.536 53.108c10.515-1.92 13.409-9.539 13.542-13.108h6.771c-4.142 8.123 11.55 12.984 19.914 14.4l-28.278 4.615c-8.365-1.17-22.464-3.987-11.949-5.907Z"
        />
        <Path
          fill="#FACE32"
          d="m123.484 74.903-7.729-2.227V78L321 77.143l-1.46-15.508h-5.382c-1.734 0-4.653 0-9.306.465s-6.204.591-15.053-.465-6.021-.93-9.671-2.028c-3.649-1.099-11.495-3.17-13.867-3.55-2.372-.38-9.853-.465-14.688-.634-4.835-.169-21.804 4.1-25.18 4.184-3.375.084-9.305 1.31-14.962 1.944-5.656.633-14.414 1.985-19.706 2.07-4.233.068-17.151 1.183-23.081 1.732-3.497.846-10.692 2.578-11.495 2.747-1.004.211-14.688 5.409-15.874 5.409-.949 0-12.256.93-17.791 1.394Z"
        />
        <Path
          fill="#FB5A21"
          d="m272.617 22.932-7.341-2.153-.039 9.19 9.614 3.963-2.234-11ZM242.162 22.852l6.648-2.116-.04 9.19-8.716 3.916 2.108-10.99Z"
        />
        <Path
          fill="#DCDFD9"
          d="m257.142 33.896.009-1.962.008-1.962.089-20.928s-4.699 1.288-7.918 7.452c-1.851 3.546-2.699 6.859-3.181 10.34-.31 2.238-.153 4.578.079 7.031l2.183.006-.006 1.308 2.559.007-.006 1.308 6.173.016.006-1.308.005-1.308Z"
        />
        <Path
          fill="#F9F1F9"
          d="m257.142 33.896.009-1.962.008-1.962.089-20.928s4.819 1.313 8.074 7.493c1.872 3.556 2.714 6.873 3.18 10.358.299 2.24.117 4.578-.143 7.03l-2.243-.006-.006 1.308-2.629-.007-.006 1.308-6.344-.016.006-1.308.005-1.308Z"
        />
        <Path
          fill="#E36018"
          d="m254.645 38.525 5.586.014c3.074.008.737 5.76-.025 5.757-.761-.002-2.803 2.315-2.803 2.315s-1.64-2.326-2.783-2.33c-1.143-.002-2.827-5.764.025-5.756Z"
        />
        <Path
          fill="#FFAE44"
          d="m255.13 38.526 4.614.012c2.54.007.611 4.32-.018 4.318-.629-.002-2.315 1.735-2.315 1.735s-1.356-1.745-2.3-1.747c-.944-.003-2.337-4.324.019-4.318Z"
        />
        <Path
          fill="#FCE25E"
          d="m255.857 38.528 3.157.008c1.738.005.419 2.88-.012 2.879-.43-.002-1.584 1.156-1.584 1.156s-.928-1.163-1.573-1.165c-.646-.001-1.6-2.882.012-2.878Z"
        />
        <Path
          fill="#5B6575"
          d="m252.16 36.499 10.253.026-.632 2.422-8.699-.022-.922-2.426Z"
        />
        <Ellipse
          cx={4.971}
          cy={3.231}
          fill="#00D5CC"
          rx={4.971}
          ry={3.231}
          transform="matrix(1 .0026 -.00427 1 252.326 12.667)"
        />
        <Path
          fill="#FB5A21"
          d="m254.954 23.118 2.184-2.158 2.165 2.17-2.233 13.785-2.116-13.797Z"
        />
      </Svg>
    );
  }

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
        <SVGTop />
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
  sectionHeader: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: Platform.OS === 'android' ? 20 : 30,
    color: "white",
    fontStyle: "normal",
  },
  IconInfoApp: {
    position:'absolute',
    right:10,
  },
  touchableContainer: {
    position: 'absolute',
  },
  sectionImageBackGround: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#f0f8ff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {width: 0,height: 2,},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: Platform.OS === 'android' ? 10 : 15,
    marginBottom: 35,
    textAlign: "center",
  },
  textStyle: {
    color: "blue",
    fontStyle: "italic",
    textAlign: "center",
  },
  buttonCloseModal:{
    justifyContent: 'center',
    alignItems: 'center',
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
});
