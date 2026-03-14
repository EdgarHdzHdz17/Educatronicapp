import { StyleSheet, TouchableOpacity, View, Animated } from "react-native";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [isSpanish, setIsSpanish] = useState(i18n.language === "es");
  const animatedValue = useRef(new Animated.Value(isSpanish ? 0 : 1)).current;

  const toggleLanguage = () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
    setIsSpanish(newLang === "es");
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isSpanish ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isSpanish, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.welcome}>{t("home.welcome")}</ThemedText>

      <View style={styles.languageContainer}>
        <ThemedText style={styles.label}>{t("home.changeLanguage")}</ThemedText>
        <TouchableOpacity
          style={styles.toggleSwitch}
          onPress={toggleLanguage}
          activeOpacity={0.8}
        >
          <View style={styles.toggleTrack}>
            <ThemedText style={styles.flagLeft}>🇪🇸</ThemedText>
            <ThemedText style={styles.flagRight}>🇺🇸</ThemedText>
          </View>
          <Animated.View
            style={[styles.toggleThumb, { transform: [{ translateX }] }]}
          />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    marginTop: 10,
    fontSize: 30,
    textAlign: "center",
    padding: 20,
  },
  languageContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "600",
  },
  toggleSwitch: {
    width: 100,
    height: 50,
    position: "relative",
  },
  toggleTrack: {
    width: 100,
    height: 50,
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  flagLeft: {
    fontSize: 20,
    zIndex: 1,
  },
  flagRight: {
    fontSize: 20,
    zIndex: 1,
  },
  toggleThumb: {
    position: "absolute",
    width: 46,
    height: 46,
    backgroundColor: "#007AFF",
    borderRadius: 23,
    top: 2,
    left: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentLang: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: "500",
  },
});
