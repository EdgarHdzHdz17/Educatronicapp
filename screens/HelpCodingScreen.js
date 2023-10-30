import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
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
              <Text style={styles.cellHeaderText}>Descricion:</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row'}}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Inicio</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>I-i</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>[No aplica]</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Inicia el programa</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row'}}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Subir</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>S-s</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>[1-6]</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Sube piso</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row'}}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Bajar</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>B-b</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>[1-6]</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Baja piso</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row'}}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Parar</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>P-p</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>[1-9]</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Permite un alto</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row'}}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Abrir</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>A-a</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>[1-9]</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Abre/Cierra puertas</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row'}}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Fin</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>F-f</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>[No aplica]</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>Fin del programa</Text>
            </View>
          </View>
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
            <Text style={styles.infoText}>
            {"\n"}El ejemplo de un programa basico tendria la siguiente
            estructura:{"\n"}
            </Text>
          </Text>

          <Text style={styles.exampleCoding}>
            I{"\n"}S 5{"\n"}P 7{"\n"}A 4{"\n"}B 3{"\n"}F
          </Text>

          <Text style={styles.infoText}>{"\n"}Comandos de voz:{"\n"}</Text>

          <View style={{ width: '95%'}}>
            <View style={{ flexDirection: 'row'}}>
              <View style={styles.cell}>
                <Text style={styles.cellHeaderText}>Instruccion:</Text>
              </ View>
              <View style={styles.cell}>
                <Text style={styles.cellHeaderText}>Comando de Voz:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellHeaderText}>Intervalo valido:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellHeaderText}>Descricion:</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Nombre</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Nombre</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>[No aplica]</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Dictado de nombre</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Codigo</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Codigo</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>[No aplica]</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Dictado de codigo</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Enter</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Enter</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>[No aplica]</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Se da un enter</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Inicio</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Inicio</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>[No aplica]</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Inicia el programa</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Subir</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Sube</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>[1-6]</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Sube piso</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Bajar</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Baja</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>[1-6]</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Baja piso</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Parar</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Para</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>[1-9]</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Permite un alto</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Abrir</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Abrir</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>[1-9]</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Abre/Cierra puertas</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Fin</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Fin</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>[No aplica]</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>Fin del programa</Text>
              </View>
            </View>
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
              <Text style={styles.infoText}>
                {"\n"}El ejemplo de un programa basico por medio de la voz es repitiendo lo siguiente:{"\n"}
              </Text>
            </Text>

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
  },
  infoText: {
    fontSize: 15,
    textAlign: "justify",
  },
  exampleCoding: {
    marginTop: "1%",
    backgroundColor: "ghostwhite",
    borderColor: "#ccc",
    borderWidth: 2,
    padding: 8,
    borderRadius: 5,
    width:'95%',
  },
  cell:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText:{
    marginBottom:5,
    marginTop:5,
  },
  cellHeaderText:{
    marginBottom:5,
    marginTop:5,
    color: "#56D0F6",
  },
});

