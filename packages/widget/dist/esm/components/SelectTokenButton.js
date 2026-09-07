import { jsx as _jsx } from "react/jsx-runtime";
import { styled } from '@mui/material/styles';
import { Card } from './Card/Card.js';
const StyledCard = styled(Card) `
  // ... existing styles ...
`;
export const SelectTokenButton = ({ children, ...props }) => {
    return (_jsx(StyledCard, { as: "div", ...props, children: children }));
};
//# sourceMappingURL=SelectTokenButton.js.map