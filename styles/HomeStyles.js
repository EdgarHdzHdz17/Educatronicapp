import { StyleSheet,Platform} from "react-native";

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

export default styles;