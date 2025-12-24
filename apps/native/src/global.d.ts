/**
 * Global type declarations for React Native
 */

declare module '*.svg' {
  import type React from 'react';
  import type { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare global {
  // Fix for react-native-screen-transitions
  var global: typeof globalThis;
}

export {};
