import React from "react";
import { View, Text, StyleSheet,FlatList} from "react-native";
import LottieView from 'lottie-react-native';
import Onboarding from 'react-native-onboarding-swiper';
import styles from "../styles/HelpAppStyles";

export default function HelpAppScreen ( ) {
  
  //Tabla de comandos de voz para navegacion
  const voiceCommandsNavegation = [
    { id: '1', command: 'Comandos de voz Navegación:\n' },
    { id: '2', command: '"Oye Edu Programar": Edu navegará a la sección Programar.\n' },
    { id: '3', command: '"Oye Edu Simular": Edu navegará a la sección Simular.\n' },
    { id: '4', command: '"Oye Edu Casa": Edu navegará a la sección Inicio.\n' },
    { id: '5', command: '"Oye Edu Tutorial": Edu navegará a la sección tutorial de ayuda del App.\n' },
  ];

  //Tabla de comandos de voz en la seccion coding
  const voiceCommandsCoding = [
    { id: '1', command: 'Comandos de voz sección Coding:\n' },
    { id: '2', command: '"Oye Edu Nombre": Edu escribirá un nombre a la seccion nombre.\n' },
    { id: '3', command: '"Oye Edu Código": Edu escribirá tus comandos en la seccion de código.\n' },
    { id: '4', command: '"Oye Edu Compilar": Edu compilará tu programa.\n' },
    { id: '5', command: '"Oye Edu Guardar": Edu guardará tu programa.\n' },
    { id: '6', command: '"Oye Edu Simulación": Edu simulará tu programa.\n' },
    { id: '7', command: '"Oye Edu Piso [1-7]": Edu colocará tu elevador en el piso indicado.\n' },
    { id: '8', command: '"Oye Edu Borrar": Edu reestablecerá todos los elementos.\n' },
    { id: '9', command: '"Oye Edu Ayuda": Edu navegará a una sección de ayuda.\n' },
  ];

  //Tabla de comandos de voz en la seccion simulations
  const voiceCommandsSimulations = [
    { id: '1', command: 'Comandos de voz sección Simulations:\n' },
    { id: '2', command: '"Sube"\n' },
    { id: '3', command: '"Baja"\n' },
    { id: '4', command: '"Abrir"\n' },
    { id: '5', command: '"Cerrar"\n' },
    { id: '6', command: '"Detener"\n' },
  ];

  return (
    <View style={styles.maincontainer}>

      <View style={[styles.containerHelpApp, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Onboarding
          showPagination={false}
          pages={[
            {
              title: 'BIENVENIDO A EDUCATRONICAPP',
              subtitle: 'Es una aplicación móvil para que inicies en el mundo de la programación.',
              backgroundColor: '#ffe4e1',
              image: (
                <View style={styles.lottie}>
                  <LottieView source={require('../assets/LottiesFiles/developerwoman.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
            {
              title: 'Navegación',
              subtitle: 'Podrás navegar por las diferentes ventanas de Educatronicapp con distintas funcionalidades.',
              backgroundColor: '#f8f8ff',
              image: (
                <View style={styles.lottie}>
                  <LottieView source={require('../assets/LottiesFiles/navigationbar.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
            {
              title: '¿Que hacer en la sección Coding?',
              subtitle: 'En esta sección podrás crear programas para manipular tu robot y ver la simulación de tus programas.Utiliza la ayuda que hay en esta sección.',
              backgroundColor: '#f0f8ff',
              image: (
                <View style={styles.lottie}>
                  <LottieView source={require('../assets/LottiesFiles/writing.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
            {
              title: '¿Que hacer en la sección Simulations?',
              subtitle: 'En esta sección podrás controlar tu robot sin necesidad de programar.',
              backgroundColor: '#ffb6c1',
              image: (
                <View style={styles.lottie}>
                  <LottieView source={require('../assets/LottiesFiles/play.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
            {
              title: 'Interfaz de voz',
              subtitle: 'Para activar la interfaz de voz necesitaras presionar un botón similar a este.',
              backgroundColor: '#dcdcdc',
              image: (
                <View style={styles.lottie}>
                  <LottieView style={styles.lottie1} source={require('../assets/LottiesFiles/micro.json')} autoPlay={true} loop={true} />
                  <LottieView style={styles.lottie2} source={require('../assets/LottiesFiles/touch.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
            { 
              title: 'Reconocimiento de voz',
              subtitle: 'Ahora solo tienes que decir un comando de voz válido y presionar de nuevo el botón.',
              backgroundColor: '#fafad2',
              image: (
                <View style={styles.lottie}>
                  <LottieView source={require('../assets/LottiesFiles/talk.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
            { 
              title: 'Comandos de voz validos de Navegación',
              subtitle: 'Solo di las siguiente frases',
              backgroundColor: '#deb887',
              image: (
                <View style={styles.lottie}>
                   <FlatList
                    data={voiceCommandsNavegation}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                      <Text style={styles.voiceCommandText}>{item.command}</Text>
                    )}
                  />
                </View>
              ),
            },
            { 
              title: 'Comandos de voz validos para la sección Codign',
              subtitle: 'Solo di las siguiente frases',
              backgroundColor: '#deb887',
              image: (
                <View style={styles.lottie}>
                   <FlatList
                    data={voiceCommandsCoding}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                      <Text style={styles.voiceCommandText}>{item.command}</Text>
                    )}
                    />
                </View>
              ),
            },
            { 
              title: 'Comandos de voz validos para la sección Simulations',
              subtitle: 'Solo di las siguiente frases',
              backgroundColor: '#deb887',
              image: (
                <View style={styles.lottie}>
                   <FlatList
                    data={voiceCommandsSimulations}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                      <Text style={styles.voiceCommandText}>{item.command}</Text>
                    )}
                    />
                </View>
              ),
            },
            { 
              title: '¡Estas listo para la aventura!',
              subtitle: 'Diviertete',
              backgroundColor: '#191970',
              image: (
                <View style={styles.lottie3}>
                  <LottieView source={require('../assets/LottiesFiles/rocket.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
          ]}
        />
      </View>

    </View>
  );
};




