import React from "react";
import { View, Text, StyleSheet,FlatList} from "react-native";
import LottieView from 'lottie-react-native';
import Onboarding from 'react-native-onboarding-swiper';

export default function HelpAppScreen ( ) {
  
  //Tabla de comandos de voz para navegacion
  const voiceCommandsNavegation = [
    { id: '1', command: 'Comandos de voz Navegacion:\n' },
    { id: '2', command: '"Oye Edu Programar": Edu navegara a la seccion Programar.\n' },
    { id: '3', command: '"Oye Edu Simular": Edu navegara a la seccion Simular.\n' },
    { id: '4', command: '"Oye Edu Casa": Edu navegara a la seccion Inicio.\n' },
    { id: '5', command: '"Oye Edu Tutorial": Edu navegara a la seccion tutorial de ayuda del App.\n' },
  ];

  //Tabla de comandos de voz en la seccion coding
  const voiceCommandsCoding = [
    { id: '1', command: 'Comandos de voz seccion Coding:\n' },
    { id: '2', command: '"Oye Edu Nombre": Edu escribira un nombre a la seccion nombre.\n' },
    { id: '3', command: '"Oye Edu Codigo": Edu escribira tus comandos en la seccion de codigo.\n' },
    { id: '4', command: '"Oye Edu Compilar": Edu compilara tu programa.\n' },
    { id: '5', command: '"Oye Edu Guardar": Edu guardara tu programa.\n' },
    { id: '6', command: '"Oye Edu Simulacion": Edu simulara tu programa.\n' },
    { id: '7', command: '"Oye Edu Piso [1-7]": Edu colocara tu elevador en el piso indicado.\n' },
    { id: '8', command: '"Oye Edu Borrar": Edu reestablecera todos los elementos.\n' },
    { id: '9', command: '"Oye Edu Ayuda": Edu navegara a una seccion de ayuda.\n' },
  ];

  //Tabla de comandos de voz en la seccion simulations
  const voiceCommandsSimulations = [
    { id: '1', command: 'Comandos de voz seccion Simulations:\n' },
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
              subtitle: 'Es una aplicacion movil para que inicies en el mundo de la programación.',
              backgroundColor: '#ffe4e1',
              image: (
                <View style={styles.lottie}>
                  <LottieView source={require('../assets/LottiesFiles/developerwoman.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
            {
              title: 'Navegacion',
              subtitle: 'Podras navegar por las diferentes ventanas de Educatronicapp con distintas funcionalidades.',
              backgroundColor: '#f8f8ff',
              image: (
                <View style={styles.lottie}>
                  <LottieView source={require('../assets/LottiesFiles/navigationbar.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
            {
              title: '¿Que hacer en la seccion Coding?',
              subtitle: 'En esta seccion podras crear programas para manipular tu robot y ver la simulacion de tus programas.Utiliza la ayuda que hay en esta seccion.',
              backgroundColor: '#f0f8ff',
              image: (
                <View style={styles.lottie}>
                  <LottieView source={require('../assets/LottiesFiles/writing.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
            {
              title: '¿Que hacer en la seccion Simulations?',
              subtitle: 'En esta seccion podras controlar tu robot sin necesidad de programar.',
              backgroundColor: '#ffb6c1',
              image: (
                <View style={styles.lottie}>
                  <LottieView source={require('../assets/LottiesFiles/play.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
            {
              title: 'Interfaz de voz',
              subtitle: 'Para activar la interfaz de voz necesitaras presionar un boton similar a este.',
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
              subtitle: 'Ahora solo tienes que decir un comando de voz valido y presionar de nuevo el boton.',
              backgroundColor: '#fafad2',
              image: (
                <View style={styles.lottie}>
                  <LottieView source={require('../assets/LottiesFiles/talk.json')} autoPlay={true} loop={true} />
                </View>
              ),
            },
            { 
              title: 'Comandos de voz validos de Navegacion',
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
              title: 'Comandos de voz validos para la seccion Codign',
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
              title: 'Comandos de voz validos para la seccion Simulations',
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
              title: 'Estas listo para la aventura!',
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

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  containerHelpApp: {
    flex: 8,
    alignItems: "center",
  },
  lottie:{
    width: 250,
    height:250,
    alignItems:'center',
    justifyContent:'center',
  },
  lottie1:{
    width: 250,
    height:250,
    marginBottom:70,
  },
  lottie2:{
    width: 250,
    height:250,
    marginBottom:30,
    position:"absolute"
  },
  lottie3:{
    width: 300,
    height:300,
  },
  voiceCommandText: {
    fontSize: 20,
  },
});


