import { jsx as _jsx } from "react/jsx-runtime";
import { WarningMessages } from '../../components/Messages/WarningMessages.js';
export const MainWarningMessages = (props) => {
    const currentRoute = props.route;
    return _jsx(WarningMessages, { route: currentRoute, ...props });
};
//# sourceMappingURL=MainWarningMessages.js.map