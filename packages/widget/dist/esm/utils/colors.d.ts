import type { Theme } from '@mui/material';
export declare const getContrastAlphaColor: (theme: Theme, value: number) => string;
export declare const getWarningBackgroundColor: (theme: Theme) => string;
export declare const getInfoBackgroundColor: (theme: Theme) => string;
/**
 * https://github.com/mui/material-ui/blob/next/packages/mui-system/src/colorManipulator/colorManipulator.js
 * Blend a transparent overlay color with a background color, resulting in a single
 * RGB color.
 * Remove in favor of MUI one once the next major version is released.
 * @param {string} background - CSS color
 * @param {string} overlay - CSS color
 * @param {number} opacity - Opacity multiplier in the range 0 - 1
 * @param {number} [gamma=1.0] - Gamma correction factor. For gamma-correct blending, 2.2 is usual.
 */
export declare function blend(background: string, overlay: string, opacity: number, gamma?: number): string;
