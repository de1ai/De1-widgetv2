import { useEffect } from 'react'
import { ChainId, ChainType } from '@de1/widget-sdk'
import {
    useLastConnectedAccount,
    useNearAccountStore,
} from '../../hooks/useAccount.js'
// @ts-ignore - runtime implementation is provided by the host app (widget package)
import { useWalletSelector } from '@near-wallet-selector/react-hook'

/**
 * Restore the signed-in Near account from wallet-selector on mount
 * so it still appears in useAccount / the wallet menu after a refresh.
 */
export const NearAccountHydrator: React.FC = () => {
    const { setNearAccount } = useNearAccountStore()
    const { setLastConnectedAccount } = useLastConnectedAccount()
    const nearWallet = useWalletSelector() as any

    useEffect(() => {
        if (!nearWallet) return

        // Currently signed-in Near account, if any
        const accountId: string | null | undefined = nearWallet.signedAccountId
        if (!accountId) return

        const connectorId: string = nearWallet.id || 'near-wallet'
        const connectorName: string =
            nearWallet.metadata?.name || 'Near Wallet'

        setNearAccount({
            address: accountId,
            chainId: ChainId.NEAR,
            chainType: ChainType.NVM,
            connector: {
                id: connectorId,
                name: connectorName,
            },
            isConnected: true,
            isConnecting: false,
            isReconnecting: false,
            isDisconnected: false,
            status: 'connected',
        })

        setLastConnectedAccount({
            id: connectorId,
            name: connectorName,
        } as any)
    }, [nearWallet?.signedAccountId, nearWallet, setNearAccount, setLastConnectedAccount])

    return null
}

