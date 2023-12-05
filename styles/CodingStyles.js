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
    sectionforName: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    programName: {
      width: "80%",
      height: "80%",
      backgroundColor: "ghostwhite",
      borderColor: "#ccc",
      borderWidth: 2,
      padding: 8,
      borderRadius: 5,
      fontSize: Platform.OS === 'android' ? 10 : 15,
    },
    sectionOfPrograms: {
      width: "100%",
      flexDirection: "row",
    },
    sectionforIcons: {
      width: "100%",
    },
    sectionforPicker: {
      width: "100%",
      alignContent:"center",
      alignItems:"center"
    },
    picker: {
      width: "90%",
      fontSize: Platform.OS === 'android' ? 10 : 15,
    },
    pickerSimulation: {
      width: "90%",
    },
    Icons: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    textComand:{
      fontSize: Platform.OS === 'android' ? 10 : 15,
    },
    sectiontextProgram: {
      width: "100%",
      alignItems: "center",
    },
    textCoding: {
      width: "90%", 
      height: "80%",
      backgroundColor: "ghostwhite",
      borderColor: "#ccc",
      borderWidth: 2,
      padding: 10,
      marginTop: "3%",
      borderRadius: 10,
      fontSize: Platform.OS === 'android' ? 10 : 15,
    },
    message: {
      margin: 8,
      textAlign: "center",
      fontSize: Platform.OS === 'android' ? 10 : 15,
    },
    resultCommand: {
      textAlign: "center",
      fontSize: Platform.OS === 'android' ? 10 : 15,
    },
    resultCheck: {
      fontSize: Platform.OS === 'android' ? 10 : 15,
      textAlign: "center",
    },
    modalView: {
      margin: 20,
      backgroundColor: "#f0f8ff",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
    },
    recordButtonContainer: {
      position: "absolute",
      bottom: 16,
      right: 16,
      backgroundColor: "#00bfff",
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonCloseModal:{
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
  })

export default styles;