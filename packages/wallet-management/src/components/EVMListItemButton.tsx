import { Avatar, ListItemAvatar } from '@mui/material'
import { ChainType } from '@de1/widget-sdk'
import type { Config, Connector } from 'wagmi'
import { connect, disconnect, getAccount } from 'wagmi/actions'
import { ListItemButton } from '../components/ListItemButton.js'
import { ListItemText } from '../components/ListItemText.js'
import type { CreateConnectorFnExtended } from '../connectors/types.js'
import {
  getSafeWagmiConfig,
  useLastConnectedAccount,
  useOptionalWagmiConfig,
} from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { WalletManagementEvent } from '../types/events.js'
import { getConnectorIcon } from '../utils/getConnectorIcon.js'
import { isWalletInstalled } from '../utils/isWalletInstalled.js'
import type { WalletListItemButtonProps } from './types.js'

interface EVMListItemButtonProps extends WalletListItemButtonProps {
  connector: CreateConnectorFnExtended | Connector
}

function resolveConnector(
  config: Config,
  connector: CreateConnectorFnExtended | Connector
) {
  if (typeof connector === 'function') {
    try {
      return config._internal.connectors.setup(connector)
    } catch {
      return connector
    }
  }
  const existing = config.connectors.find(
    (item) =>
      item.uid === connector.uid ||
      item.id === connector.id
  )
  return existing ?? connector
}

export const EVMListItemButton = ({
  ecosystemSelection,
  connector,
  onNotInstalled,
  onConnected,
  onConnecting,
  onError,
}: EVMListItemButtonProps) => {
  const emitter = useWalletManagementEvents()
  const config = useOptionalWagmiConfig()
  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectorName =
    (connector as CreateConnectorFnExtended).displayName || connector.name
  const connectorDisplayName: string = ecosystemSelection
    ? 'Ethereum'
    : connectorName

  const handleEVMConnect = async () => {
    const wagmiConfig = getSafeWagmiConfig(config)
    try {
      const connectorId = (connector as Connector).id
      const identityCheckPassed = isWalletInstalled(connectorId)
      if (!identityCheckPassed) {
        onNotInstalled?.(connector as Connector)
      }
      const resolvedConnector = resolveConnector(wagmiConfig, connector)
      const connectedAccount = getAccount(wagmiConfig)
      onConnecting?.()
      const data = await connect(wagmiConfig, { connector: resolvedConnector })
      if (connectedAccount.connector) {
        await disconnect(wagmiConfig, {
          connector: connectedAccount.connector,
        })
      }
      setLastConnectedAccount(connector)
      emitter.emit(WalletManagementEvent.WalletConnected, {
        address: data.accounts[0],
        chainId: data.chainId,
        chainType: ChainType.EVM,
        connectorId: connector.id,
        connectorName: connectorName,
      })
      onConnected?.()
    } catch (error) {
      console.error('Failed to connect EVM wallet', error)
      onError?.(error)
    }
  }

  return (
    <ListItemButton key={connector.id} onClick={handleEVMConnect}>
      <ListItemAvatar>
        <Avatar
          src={
            ecosystemSelection
              ? 'https://s3.de1.exchange/token_logos/logos/1745547950692_04886906894908105.svg'
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
