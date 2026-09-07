import { Avatar, ListItemAvatar } from '@mui/material'
import { ChainType } from '@de1/widget-sdk'
import type { Connector } from 'wagmi'
import { connect, disconnect, getAccount } from 'wagmi/actions'
import { ListItemButton } from '../components/ListItemButton.js'
import { ListItemText } from '../components/ListItemText.js'
import type { CreateConnectorFnExtended } from '../connectors/types.js'
import {
  useLastConnectedAccount,
  useOptionalBigmiConfig,
} from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { WalletManagementEvent } from '../types/events.js'
import { getConnectorIcon } from '../utils/getConnectorIcon.js'
import { isWalletInstalled } from '../utils/isWalletInstalled.js'
import type { WalletListItemButtonProps } from './types.js'

interface UTXOListItemButtonProps extends WalletListItemButtonProps {
  connector: CreateConnectorFnExtended | Connector
}

export const UTXOListItemButton = ({
  ecosystemSelection,
  connector,
  onNotInstalled,
  onConnected,
  onConnecting,
  onError,
}: UTXOListItemButtonProps) => {
  const emitter = useWalletManagementEvents()
  const config = useOptionalBigmiConfig()
  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectorName =
    (connector as CreateConnectorFnExtended).displayName || connector.name
  const connectorDisplayName: string = ecosystemSelection
    ? 'Bitcoin'
    : connectorName

  const handleUTXOConnect = async () => {
    if (!config) {
      onError?.(new Error('Bitcoin wallet provider is not available'))
      return
    }
    try {
      const identityCheckPassed = isWalletInstalled((connector as Connector).id)
      if (!identityCheckPassed) {
        onNotInstalled?.(connector as Connector)
        return
      }
      const connectedAccount = getAccount(config)
      onConnecting?.()
      const data = await connect(config, { connector })
      if (connectedAccount.connector) {
        await disconnect(config, { connector: connectedAccount.connector })
      }
      setLastConnectedAccount(connector)
      emitter.emit(WalletManagementEvent.WalletConnected, {
        address: data.accounts[0],
        chainId: data.chainId,
        chainType: ChainType.UTXO,
        connectorId: connector.id,
        connectorName: connectorName,
      })
      onConnected?.()
    } catch (error) {
      onError?.(error)
    }
  }

  return (
    <ListItemButton key={connector.id} onClick={handleUTXOConnect}>
      <ListItemAvatar>
        <Avatar
          src={
            ecosystemSelection
              ? 'https://s3.de1.exchange/token_logos/logos/1745548017222_7956109406125961.svg'
              : getConnectorIcon(connector as Connector)
          }
          alt={connectorDisplayName}
        >
          {connectorDisplayName?.[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={connectorDisplayName} />
    </ListItemButton>
  )
}
