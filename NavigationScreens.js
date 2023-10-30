//Importacion de bibliotecas, librerias o componentes de otros archivos
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Importacion de las diferentes ventanas
import HomeScreen from "./screens/HomeScreen";
import CodingScreen from "./screens/CodingScreen";
import SimulationScreen from "./screens/SimulationScreen";
import HelpCodingScreen from "./screens/HelpCodingScreen";
import HelpAppScreen from "./screens/HelpAppScreen";

const Tab = createBottomTabNavigator();//Componente de navegacion para la parte inferior

const HomeCodingScreen = createNativeStackNavigator();//Constante para crear un componente Stack de navegacion dentro del componente principal
const HomeHomeScreen = createNativeStackNavigator();//Constante para crear un componente Stack de navegacion dentro del componente principal

//Funcion para generar ventanas dentro de la ventana CodingScreen
function HomeCoding() {
  return (
    <HomeCodingScreen.Navigator initialRouteName="CodingScreen">
      <HomeCodingScreen.Screen
        name="CodingScreen"
        component={CodingScreen}
        options={{
          headerShown: false,
        }}
      ></HomeCodingScreen.Screen>
      <HomeCodingScreen.Screen
        name="HelpCodingScreen"
        component={HelpCodingScreen}
        options={{
          headerShown: false,
        }}
      ></HomeCodingScreen.Screen>
    </HomeCodingScreen.Navigator>
  );
}

//Funcion para generar ventanas dentro de la ventana CodingScreen
function HomepApp() {
  return (
    <HomeHomeScreen.Navigator initialRouteName="HomeScreen">
      <HomeHomeScreen.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      ></HomeHomeScreen.Screen>
      <HomeHomeScreen.Screen
        name="HelpAppScreen"
        component={HelpAppScreen}
        options={{
          headerShown: false,
        }}
      ></HomeHomeScreen.Screen>
    </HomeHomeScreen.Navigator>
  );
}

export default function NavigationScreens() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Coding") {
              iconName = focused ? "code" : "code-outline";
            } else if (route.name === "Simulations") {
              iconName = focused ? "game-controller" : "game-controller-outline";
            }

            // Tab.Navigator se usa para colocar la seccion de navegacion
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "deepskyblue", //Color mientras esta activa la ventana
          tabBarInactiveTintColor: "gray", //Color mientras esta inactiva la ventana
          tabBarHideOnKeyboard: true,//Se oculta la tab mientras el teclado este activo
        })}
      >
        <Tab.Screen
          name="Coding"
          component={HomeCoding}//Tab de Coding
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomepApp}//Tab de Home
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Simulations"
          component={SimulationScreen}//Tab de Simulacion
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
