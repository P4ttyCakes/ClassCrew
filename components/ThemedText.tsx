import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'heading' | 'caption' | 'stat' | 'label';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'heading' ? styles.heading : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'stat' ? styles.stat : undefined,
        type === 'label' ? styles.label : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'System',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: 'System',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily: 'System',
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B4EFF',
    fontWeight: '600',
    fontFamily: 'System',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    color: '#687076',
    fontFamily: 'System',
  },
  stat: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily: 'System',
  },
});
