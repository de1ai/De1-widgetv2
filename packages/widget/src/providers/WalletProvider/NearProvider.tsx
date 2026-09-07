import type { FC, PropsWithChildren } from 'react'
import { useEffect, useMemo } from 'react'
import { WalletSelectorProvider } from '@near-wallet-selector/react-hook'
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet'
import { setupSender } from '@near-wallet-selector/sender'
import "@near-wallet-selector/modal-ui/styles.css";


export const NearProvider: FC<PropsWithChildren> = ({ children }) => {
  const config = useMemo(
    () => ({
      network: 'mainnet' as const,
      modules: [setupMeteorWallet(), setupSender()],
    }),
    []
  )

  // Inject global CSS to override the Near modal styles
  useEffect(() => {
    const styleId = 'near-wallet-selector-custom-style'
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }

    styleEl.textContent = `
      /* Override the Near modal root */
      #near-wallet-selector-modal {
        z-index: 1200 !important;    /* keep it above the widget */
        font-family: inherit;        /* or use a custom font */
      }

      /* Override the overlay */
      #near-wallet-selector-modal .nws-modal-overlay {
        background: rgba(0, 0, 0, 0.75) !important;
      }

      /* Override the content panel (radius / shadow / etc.) */
      #near-wallet-selector-modal .nws-modal {
        width: 420px !important;
        border-radius: 24px;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
        background-color: #222037 !important;
        z-index: 1300 !important;
        position: absolute;
      }
      #near-wallet-selector-modal .nws-modal .modal-left {
        border:none !important;
        width: 100% !important;
      }
      #near-wallet-selector-modal .nws-modal .modal-right {
        background-color: #222037 !important;
        display: none;
      }
      .nws-modal-wrapper .nws-modal .modal-left .modal-left-title{
        padding-top: 0 !important;
      }
      .nws-modal-wrapper .nws-modal .modal-left .modal-left-title h2{
        text-align: center;
        color: #ffffff !important;
      }
      .nws-modal-wrapper .nws-modal .modal-left .modal-left-title .nws-remember-wallet{
        display: none;
      }
      .nws-modal-wrapper .nws-modal .modal-left .modal-left-title .nws-switch{
        display: none;
      }
      .nws-modal-wrapper .nws-modal .modal-left .modal-left-title {
        position: relative;
        width: 100%;
        background-color: #222037 !important;
      }
      .nws-modal-wrapper .nws-modal .wallet-options-wrapper{
        margin-top: 20px;
      }
      .nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list {
        display: block;

      }
      .nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar{
        margin:10px 0;
      }
      .nws-modal-wrapper .nws-modal .wallet-options-wrapper .title{
        color: #ffffff !important;
      }
      .options-list-section-header{
        display: none !important;
      }
      .nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar.selected-wallet{
        background-color: inherit;
      }
      .nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar.selected-wallet:hover{
        background-color: #2d3860;
      }
    `
    // Keep the stylesheet; no need to remove it on unmount
  }, [])



  return (
    <WalletSelectorProvider config={config}>
      {children}
    </WalletSelectorProvider>
  )
}

