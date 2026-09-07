import { jsx as _jsx } from "react/jsx-runtime";
import { PowerSettingsNewRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useAccountDisconnect, } from '@de1/wallet-management';
export const DisconnectIconButton = ({ account }) => {
    const disconnect = useAccountDisconnect();
    return (_jsx(IconButton, { size: "medium", onClick: async (e) => {
            e.stopPropagation();
            await disconnect(account);
        }, children: _jsx(PowerSettingsNewRounded, {}) }));
};
//# sourceMappingURL=DisconnectIconButton.js.map