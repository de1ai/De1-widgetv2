import { Button } from '@mui/material'
import { useAccount, useWalletMenu } from '@de1/wallet-management'
import { ChainType } from '@de1/widget-sdk'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import type { BaseTransactionButtonProps } from './types.js'
import { useWalletSelector } from '@near-wallet-selector/react-hook'

export const BaseTransactionButton: React.FC<BaseTransactionButtonProps> = ({
  onClick,
  text,
  disabled,
  loading,
}) => {
  const { t } = useTranslation()
  const { walletConfig } = useWidgetConfig()
  const { openWalletMenu } = useWalletMenu()
  const [fromChainId] = useFieldValues('fromChain')
  const { chain } = useChain(fromChainId)
  const { account } = useAccount({ chainType: chain?.chainType })
  const nearWallet = useWalletSelector() as any
  const isNearChain = chain?.chainType === ChainType.NVM
  const handleClick = async () => {
    if (account.isConnected) {
      onClick?.()
    } else if (isNearChain && nearWallet) {
      // Near: skip the internal wallet menu and use Near wallet-selector login,
      // which shows its own UI (Meteor / Sender / etc.).
      await nearWallet.signIn?.({
        contractId: '',
        methodNames: [],
      })
      // Force the .modal-left-title h2 text to "Connect Wallet"
      const interval = setInterval(() => {
        const h2 = document.querySelector('.modal-left-title h2');
        if (h2 && h2.textContent !== 'Connect Wallet') {
          h2.textContent = 'Connect Wallet';
          clearInterval(interval);
        }
      }, 50);
      setTimeout(() => clearInterval(interval), 3000); // stop after 3 seconds
    } else if (walletConfig?.onConnect) {
      walletConfig.onConnect()
    } else {
      openWalletMenu(
        chain?.chainType ? { chainType: chain.chainType } : undefined
      )
    }
  }

  const getButtonText = () => {
    if (account.isConnected) {
      if (text) {
        return text
      }
    }
    return t('button.connectWallet')
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={account.isConnected && disabled}
      loading={loading}
      loadingPosition="center"
      fullWidth
    >
      {getButtonText()}
    </Button>
  )
}
