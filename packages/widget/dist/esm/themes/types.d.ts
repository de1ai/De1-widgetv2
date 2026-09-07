import type { CardProps, ComponentsOverrides, ComponentsVariants } from '@mui/material';
import type { CSSProperties } from 'react';
import type { NavigationProps } from '../types/widget.js';
declare module '@mui/material/styles' {
    interface TypographyVariants {
        '@supports (font-variation-settings: normal)': React.CSSProperties;
    }
    interface TypographyVariantsOptions {
        '@supports (font-variation-settings: normal)'?: React.CSSProperties;
    }
    interface Shape {
        borderRadius: number;
        borderRadiusSecondary: number;
        borderRadiusTertiary: number;
    }
    interface Theme {
        shape: Shape;
        container: CSSProperties;
        header: CSSProperties;
        navigation: NavigationProps;
    }
    interface ThemeOptions {
        shape?: Partial<Shape>;
        container?: CSSProperties;
        header?: CSSProperties;
        navigation?: NavigationProps;
    }
    interface ComponentNameToClassKey {
        MuiInputCard: 'root';
    }
    interface ComponentsPropsList {
        MuiInputCard: Partial<CardProps>;
    }
    interface Components {
        MuiInputCard?: {
            defaultProps?: ComponentsPropsList['MuiInputCard'];
            styleOverrides?: ComponentsOverrides<Omit<Theme, 'components'>>['MuiInputCard'];
            variants?: ComponentsVariants['MuiInputCard'];
        };
    }
}
declare module '@mui/material/Paper' {
    interface PaperPropsVariantOverrides {
        filled: true;
    }
}
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        '@supports (font-variation-settings: normal)': true;
    }
}
