import { View, SafeAreaView, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  useSafeArea?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, useSafeArea = true, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  
  const Component = useSafeArea ? SafeAreaView : View;

  return <Component style={[{ backgroundColor, flex: 1 }, style]} {...otherProps} />;
}
