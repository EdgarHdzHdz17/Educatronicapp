import { Dimensions } from 'react-native';

const sectionBuildWidth = Dimensions.get('window').width;// Ancho del area para los elementos
const sectionBuildHeight = Dimensions.get('window').height * 0.7;// Alto del area para los elementos

//Declaracion de variables para la posicion de los niveles del elevador
const level7Elevator = sectionBuildHeight * 0.05;
const level6Elevator = sectionBuildHeight * 0.15;
const level5Elevator = sectionBuildHeight * 0.25;
const level4Elevator = sectionBuildHeight * 0.35;
const level3Elevator = sectionBuildHeight * 0.45;
const level2Elevator = sectionBuildHeight * 0.55;
const level1Elevator = sectionBuildHeight * 0.75;

//Arreglo de las variables de los niveles de elevador
const levelsElevator = [level1Elevator, level2Elevator, level3Elevator, level4Elevator, level5Elevator, level6Elevator, level7Elevator];

const doorOpen = sectionBuildWidth * 0.70;//Posicion de la puerta abierta
const doorClose = sectionBuildWidth * 0.73;//Posicion de la puerta cerrada 

const doorElevator = [doorOpen, doorClose];//Arreglo de las variables de la puerta

export { levelsElevator, doorElevator};
