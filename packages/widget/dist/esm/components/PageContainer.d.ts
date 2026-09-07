import type { ContainerProps } from '@mui/material';
export interface PageContainerProps extends ContainerProps {
    halfGutters?: boolean;
    topGutters?: boolean;
    bottomGutters?: boolean;
}
export declare const PageContainer: import("@emotion/styled").StyledComponent<import("@mui/material").ContainerOwnProps & import("@mui/material/OverridableComponent").CommonProps & Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "maxWidth" | "children" | "sx" | "style" | "className" | "fixed" | "classes" | "disableGutters"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & PageContainerProps, {}, {}>;
