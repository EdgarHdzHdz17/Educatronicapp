import { View, SafeAreaView, type ViewProps } from "react-native";

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

  const Component = useSafeArea ? SafeAreaView : View;
  const padding = noPadding ? 0 : 20;

  return (
    <Component
      style={[{ backgroundColor, flex: 1, padding }, style]}
      {...otherProps}
    />
  );
}
