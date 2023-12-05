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
    sectionforIcons: {
      width: "100%",
    },
    sectionforElementsSimulations: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
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
    textScreen:{
      fontSize: Platform.OS === 'android' ? 10 : 15,
    }
  });

  export default styles;