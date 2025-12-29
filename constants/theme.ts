/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#8a2be2ff';
const tintColorDark = '#8a2be2ff'; // Match light mode tint

export const Colors = {
  light: {
    text: '#333333',
    background: '#FFFFFF', // Changed from #FDFBFA
    tint: tintColorLight,
    icon: '#8a2be2ff',
    tabIconDefault: '#E0E0E0',
    tabIconSelected: tintColorLight,
    primary: '#8a2be2ff',
    action: '#8a2be2ff',
    cta: '#F26C6C',
    white: '#FFFFFF',
    border: '#E0E0E0',
  },
  dark: {
    text: '#333333', // Dark text on white background
    background: '#FFFFFF', // Always white
    tint: tintColorDark,
    icon: '#4A2E6F',
    tabIconDefault: '#E0E0E0',
    tabIconSelected: tintColorDark,
    primary: '#4A2E6F',
    action: '#8A2BE2',
    cta: '#F26C6C',
    white: '#FFFFFF',
    border: '#E0E0E0',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
