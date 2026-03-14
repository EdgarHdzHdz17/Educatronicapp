import { View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  useSafeArea?: boolean;
  noPadding?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  useSafeArea = true,
  noPadding = false,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  const padding = noPadding ? 0 : 10;

  if (useSafeArea) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={[{ backgroundColor, flex: 1, padding }, style]}
        {...otherProps}
      />
    );
  }

  return (
    <View
      style={[{ backgroundColor, flex: 1, padding }, style]}
      {...otherProps}
    />
  );
}
