import type { FormType } from '../../stores/form/types.js';
export declare const SelectTokenCardHeader: import("@emotion/styled").StyledComponent<import("@mui/material").CardHeaderOwnProps<"span", "span"> & import("@mui/material").CardHeaderSlotsAndSlotProps & import("@mui/material/OverridableComponent").CommonProps & Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "sx" | "style" | "title" | "className" | "classes" | "action" | "slots" | "slotProps" | "avatar" | "disableTypography" | "subheader" | "subheaderTypographyProps" | "titleTypographyProps"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & {
    selected?: boolean;
    compact?: boolean;
}, {}, {}>;
export declare const SelectTokenCard: import("@emotion/styled").StyledComponent<import("@mui/material").CardOwnProps & import("@mui/material/OverridableComponent").CommonProps & Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "children" | "sx" | "style" | "className" | "square" | "classes" | "variant" | "elevation" | "raised"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & import("../Card/Card.js").CardProps, {}, {}>;
export declare const CardContent: import("@emotion/styled").StyledComponent<import("@mui/material").CardContentOwnProps & import("@mui/material/OverridableComponent").CommonProps & Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "children" | "sx" | "style" | "className" | "classes"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & {
    formType: FormType;
    compact: boolean;
}, {}, {}>;
