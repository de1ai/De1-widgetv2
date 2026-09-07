import type { CardProps as MuiCardProps } from '@mui/material';
export interface CardProps extends MuiCardProps {
    type?: 'default' | 'selected' | 'error';
    selectionColor?: 'primary' | 'secondary';
    indented?: boolean;
}
export declare const Card: import("@emotion/styled").StyledComponent<import("@mui/material").CardOwnProps & import("@mui/material/OverridableComponent").CommonProps & Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "children" | "sx" | "style" | "className" | "square" | "classes" | "variant" | "elevation" | "raised"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & CardProps, {}, {}>;
