import './assets/fonts/fonts.css';

import darkPalette from './colors-dark';
import lightPalette from './colors';

import { default as useThemeMode } from './hooks/useThemeMode';

import { default as createSafeTheme } from './safeTheme';

import { default as SafeThemeProvider } from './SafeThemeProvider';

export {
  useThemeMode,
  createSafeTheme,
  SafeThemeProvider,
  darkPalette,
  lightPalette,
};
