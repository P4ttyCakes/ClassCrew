/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#FC4C02';  // Strava Orange
const tintColorDark = '#FC4C02';

export const Colors = {
  light: {
    text: '#242428',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#666666',
    tabIconDefault: '#666666',
    tabIconSelected: tintColorLight,
    cardBackground: '#F7F7FA',
    border: '#E5E5EA',
    mapOverlay: 'rgba(255, 255, 255, 0.9)',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FC4C02',
  },
  dark: {
    text: '#FFFFFF',
    background: '#242428',
    tint: tintColorDark,
    icon: '#A3A3A3',
    tabIconDefault: '#A3A3A3',
    tabIconSelected: tintColorDark,
    cardBackground: '#2C2C2E',
    border: '#3A3A3C',
    mapOverlay: 'rgba(36, 36, 40, 0.9)',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FC4C02',
  },
};
