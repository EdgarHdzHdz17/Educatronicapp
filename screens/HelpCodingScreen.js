import React from "react";
import { View, Text, StyleSheet, ScrollView,Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";

//Componente SVG Top
function SVGTop() {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={321} height={70} fill="none">
      <Path
        fill="#56D0F6"
        d="M0 25C0 11.193 11.193 0 25 0h271c13.807 0 25 11.193 25 25v53H0V25Z"
      />
      <Path
        fill="#F9FCFF"
        fillRule="evenodd"
        d="M259.321 60h-59.062C190.727 60 183 52.62 183 43.517c0-9.103 7.727-16.482 17.259-16.482 1.993 0 3.908.323 5.69.917C209.377 22.019 215.992 18 223.59 18c6.731 0 12.69 3.154 16.346 8a18.9 18.9 0 0 1 1.551-.064c6.451 0 12.102 3.271 15.234 8.172a14.379 14.379 0 0 1 2.6-.236c7.555 0 13.679 5.849 13.679 13.064S266.876 60 259.321 60ZM120.366 41.907c.488-1.779.527-3.686.022-5.57-1.586-5.919-7.936-9.36-14.183-7.687-3.543.95-6.293 3.341-7.72 6.313-2.386-1.37-5.36-1.826-8.308-1.036-3.905 1.047-6.755 4.007-7.706 7.504-.858.025-1.729.15-2.598.382-5.714 1.531-9.17 7.161-7.72 12.575 1.451 5.415 7.26 8.562 12.973 7.031a11.118 11.118 0 0 0 4.847-2.721c2.574 2.466 6.457 3.55 10.298 2.522a11.08 11.08 0 0 0 5.355-3.245c2.604 3.679 7.492 5.508 12.317 4.215 6.107-1.636 9.8-7.653 8.25-13.438-.836-3.122-3.028-5.538-5.827-6.845Z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

const DataRow = ({ instruction, abbreviated, interval, description }) => (
  <View style={{ flexDirection: 'row' }}>
    <View style={styles.cell}>
      <Text style={styles.cellText}>{instruction}</Text>
    </View>
    <View style={styles.cell}>
      <Text style={styles.cellText}>{abbreviated}</Text>
    </View>
    <View style={styles.cell}>
      <Text style={styles.cellText}>{interval}</Text>
    </View>
    <View style={styles.cell}>
      <Text style={styles.cellText}>{description}</Text>
    </View>
  </View>
);

//Componente principal
export default function HelpCodingScreen () {

  const navigation = useNavigation(); //Permite hacer la navegacion para los iconos

  return (
    <View style={styles.maincontainer}>
      <View style={[styles.containerSVG, { flex: 1.3, backgroundColor: "#56D0F6" }]}>
        <SVGTop />
      </View>

      <View style={[styles.containerIconReturn, { flex: 0.5 }]}>
        <Icon name="arrow-undo" size={30} color="black" onPress={() => navigation.navigate("CodingScreen")}></Icon>
      </View>

      <View style={[styles.containerInfoHelpCoding, { flex: 8 }]}>
        <ScrollView contentContainerStyle={styles.infoElements}>
        <Text style={styles.headerText}>¿COMO CREAR MI PRIMER PROGRAMA?{"\n"}</Text>
        <Text style={styles.infoText}>
          El lenguaje LCS es un lenguaje compuesto por instrucciones basicas y
          palabras reservadas, para crear tu primer programa debes tener en
          cuenta las siguientes intrucciones:{"\n"}
        </Text>
        
        <Text style={styles.infoText}>Comandos:{"\n"}</Text>

        <View style={{ width: '95%'}}>
          <View style={{ flexDirection: 'row'}}>
            <View style={styles.cell}>
              <Text style={styles.cellHeaderText}>Instruccion:</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellHeaderText}>Comando Abreviado:</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellHeaderText}>Intervalo valido:</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellHeaderText}>Descripcion:</Text>
            </View>
          </View>
        </View>

        <View style={{ width: '95%' }}>
          <DataRow instruction="Inicio" abbreviated="I-i" interval="[No aplica]" description="Inicia el programa" />
          <DataRow instruction="Subir" abbreviated="S-s" interval="[1-6]" description="Sube piso" />
          <DataRow instruction="Bajar" abbreviated="B-b" interval="[1-6]" description="Baja piso" />
          <DataRow instruction="Parar" abbreviated="P-p" interval="[1-9]" description="Permite un alto" />
          <DataRow instruction="Abrir" abbreviated="A-a" interval="[1-9]" description="Abre/Cierra puertas" />
          <DataRow instruction="Fin" abbreviated="F-f" interval="[No aplica]" description="Fin del programa" />
        </View>

        <Text style={styles.infoText}>
            {"\n"}Notas importantes:{"\n"}
            {"\n"}La estrutura basica para un programa valido corresponde de un
            comando Inicio, seguido por comandos de instrucciones validas y
            para terminar un comando Fin.{"\n"}
            {"\n"}Debes iniciar tu programa con el comando I o i.{"\n"}
            {"\n"}Debes terminar tu programa con el comando F o f{"\n"}
            {"\n"}La sintaxis del lenguaje no hace diferencia entre mayusculas y
            minusculas.{"\n"}
            {"\n"}Un intervalo valida para los comandos corresponde a:{"\n"}
            Pisos/Tiempo.{"\n"}
            {"\n"}Un comando indica la accion a llevar acabo.{"\n"}
            {"\n"}En la parte superior de nuestro programa habra un status sobre
            si es correcto la sintaxis o si tenemos un error.{"\n"}
          </Text>

          <Text style={styles.infoText}>Ejemplo Basico:{"\n"}</Text>

          <Text style={styles.exampleCoding}>
            I{"\n"}S 3{"\n"}B 1{"\n"}F
          </Text>

          <Text style={styles.infoText}>{"\n"}Ejemplo Avanzado:{"\n"}</Text>

          <Text style={styles.exampleCoding}>
            I{"\n"}S 5{"\n"}P 7{"\n"}A 4{"\n"}B 3{"\n"}F
          </Text>

          <Text style={styles.infoText}>{"\n"}Comandos de voz:{"\n"}</Text>

          <View style={{ width: '95%'}}>
            <View style={{ flexDirection: 'row'}}>
              <View style={styles.cell}>
              <Text style={styles.cellHeaderText}>Instruccion:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellHeaderText}>Comando de Voz:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellHeaderText}>Intervalo valido:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellHeaderText}>Descripcion:</Text>
              </View>
            </View>
          </View>

          <View style={{ width: '95%' }}>
            <DataRow instruction="Nombre" abbreviated="Nombre" interval="[No aplica]" description="Dictado de nombre" />
            <DataRow instruction="Codigo" abbreviated="Codigo" interval="[No aplica]" description="Dictado de codigo" />
            <DataRow instruction="Enter" abbreviated="Enter" interval="[No aplica]" description="Se da un enter" />
            <DataRow instruction="Inicio" abbreviated="Inicio" interval="[No aplica]" description="Inicia el programa" />
            <DataRow instruction="Subir" abbreviated="Sube" interval="[1-6]" description="Sube piso" />
            <DataRow instruction="Bajar" abbreviated="Baja" interval="[1-6]" description="Baja piso" />
            <DataRow instruction="Parar" abbreviated="Para" interval="[1-9]" description="Permite un alto" />
            <DataRow instruction="Abrir" abbreviated="Abrir" interval="[1-9]" description="Abre/Cierra puertas" />
            <DataRow instruction="Fin" abbreviated="Fin" interval="[No aplica]" description="Fin del programa" />
          </View>

          <Text style={styles.infoText}>
            {"\n"}Notas importantes:{"\n"}
            {"\n"}Para el uso de comandos de voz es necesario un comando en especifico para su activacion.{"\n"}
            {"\n"}Para nombrar tu programa di "Nombre" seguido del nombre.{"\n"}
            {"\n"}Para comenzar a dictar tu programa di "Codigo" seguido de tus instrucciones.{"\n"}
            {"\n"}La sintaxis del lenguaje de voz no hace diferencia entre mayusculas y minusculas.{"\n"}
            {"\n"}Un comando de voz indica la accion a llevar acabo.{"\n"}
            {"\n"}La estrutura basica para un programa valido con el uso de la voz corresponde de un comando de activacion por voz "Codigo" seguido por comandos de instrucciones.{"\n"}
            {"\n"}Para dar un enter debes decir "Enter".{"\n"}
            {"\n"}Para terminar de dictar tu programa debes decir "Fin".{"\n"}
            {"\n"}Es muy importante que despues de terminar tu programa des 1 espacio en blanco".{"\n"}
          </Text>

          <Text style={styles.infoText}>Ejemplo Basico:{"\n"}</Text>

          <Text style={styles.exampleCoding}>
            Codigo Inicio Enter{"\n"}Sube Dos Enter{"\n"}Baja Uno Enter{"\n"}Fin
          </Text>

          <Text style={styles.infoText}>{"\n"}Ejemplo Avanzado:{"\n"}</Text>

          <Text style={styles.exampleCoding}>
            Codigo Inicio Enter{"\n"}Sube Cinco Enter{"\n"}Para Siete Enter{"\n"}Abrir Cinco Enter{"\n"}Baja Tres Enter{"\n"}Fin
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  containerSVG: {
    width: "100%",
    alignItems: "center",
  },
  containerIconReturn: {
    width: "95%",
    alignItems: "flex-start",
  },
  containerInfoHelpCoding: {
    width: "95%",
  },
  infoElements:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    color: "#56D0F6",
    textAlign: "center",
    fontSize: Platform.OS === 'android' ? 10 : 15,
  },
  infoText: {
    fontSize: 15,
    textAlign: "justify",
    fontSize: Platform.OS === 'android' ? 10 : 15,
  },
  exampleCoding: {
    marginTop: "1%",
    backgroundColor: "ghostwhite",
    borderColor: "#ccc",
    borderWidth: 2,
    padding: 8,
    borderRadius: 5,
    width:'95%',
    fontSize: Platform.OS === 'android' ? 10 : 15,
  },
  cell:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText:{
    marginBottom:5,
    marginTop:5,
    fontSize: Platform.OS === 'android' ? 10 : 15,
  },
  cellHeaderText:{
    marginBottom:5,
    marginTop:5,
    color: "#56D0F6",
    fontSize: Platform.OS === 'android' ? 10 : 15,
  },
});

