import { Collapse, MenuItem, type SelectChangeEvent } from '@mui/material'
import type * as React from 'react'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import { useConfig } from '../../../store/widgetConfig/useConfig'
import { useConfigWalletManagement } from '../../../store/widgetConfig/useConfigValues'
import { useEffect, useState } from 'react';
import {
  Card,
  CardRowContainer,
  CardTitleContainer,
  CardValue,
} from '../../Card/Card.style'
import { Switch } from '../../Switch'
import {
  Select,
} from './DesignControls.style'

import { useNavigate } from 'react-router-dom';
import { getChains } from '../../../utils/chains';
import { Autocomplete, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { De1Service } from '@de1/widget'

export const DefaultChainToken = () => {
  const { config } = useConfig();
  const { setConfig, setWalletConfig } = useConfigActions();
  const navigate = useNavigate();

  // State for chain and token
  const [chains, setChains] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [chainLoading, setChainLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [chainError, setChainError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  // Available chains (multi-select)
  const [availableChains, setAvailableChains] = useState<any[]>([]);

  // Get chain list
  useEffect(() => {
    setChainLoading(true);
    setChainError(null);
    const chainList = getChains();
    setChains(chainList || []);
    setAvailableChains(chainList.map(c => c.chainId)); // Select all by default
    setChainLoading(false);
  }, []);

  // Linkage: When available chains change, update config.chains.allow and check default chain
  useEffect(() => {
    if (availableChains.length > 0) {
      let newDefaultChain = config?.defaultChain;
      if (!availableChains.includes(config?.defaultChain)) {
        newDefaultChain = availableChains[0];
      }
      setConfig({
        ...(config ?? {}),
        chains: {
          ...(config?.chains ?? {}),
          allow: availableChains,
        },
        defaultChain: newDefaultChain,
      });
    }
  }, [availableChains]);

  useEffect(() => {
    if (config && config.isDefaultValueEnabled === false) {
      navigate('/', { replace: true });
    }
  }, [config?.isDefaultValueEnabled, navigate]);

  // Get token list for the selected default chain
  useEffect(() => {
    if (!config?.defaultChain) {
      setTokens([]);
      return;
    }
    setTokenLoading(true);
    setTokenError(null);
    De1Service.getTokenList(
      String(config.defaultChain),
      !!config?.isRwaTokenEnabled
    )
      .then(tokenList => {
        setTokens([...tokenList]);
        setTokenLoading(false);

        // After tokens are loaded, set default token
        const chain = chains.find(c => String(c.chainId) === String(config.defaultChain));
        if (chain && tokenList.length > 0) {
          let defaultFromAddress = chain.defaultToken?.in.address;
          let defaultToAddress = chain.defaultToken?.out.address;

          // Match by address first
          let fromToken = tokenList.find((token: any) => token.address === defaultFromAddress);
          let toToken = tokenList.find((token: any) => token.address === defaultToAddress);

          // If not found, match by symbol
          if (!fromToken && chain.defaultToken?.in.symbol) {
            fromToken = tokenList.find((token: any) => token.symbol?.toLowerCase() === chain.defaultToken.in.symbol.toLowerCase());
            if (fromToken) defaultFromAddress = fromToken.address;
          }
          if (!toToken && chain.defaultToken?.out.symbol) {
            toToken = tokenList.find((token: any) => token.symbol?.toLowerCase() === chain.defaultToken.out.symbol.toLowerCase());
            if (toToken) defaultToAddress = toToken.address;
          }

          // Set config at once to avoid overwriting
          const newConfig: any = { ...(config ?? {}) };
          if (fromToken && defaultFromAddress) {
            newConfig.defaultFromToken = defaultFromAddress;
          }
          if (toToken && defaultToAddress) {
            newConfig.defaultToToken = defaultToAddress;
          }
          setConfig(newConfig);
        }
      })
      .catch(e => {
        setTokenError('Failed to fetch tokens');
        setTokenLoading(false);
      });
  }, [config?.defaultChain, config?.isRwaTokenEnabled, chains]);

  const handleDefaultValueEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    if (!checked) {
      // Reset defaultChain/defaultFromToken/defaultToToken, allow all chains
      setConfig({
        ...(config ?? {}),
        isDefaultValueEnabled: false,
        defaultChain: undefined,
        defaultFromToken: undefined,
        defaultToToken: undefined,
        chains: {
          ...(config?.chains ?? {}),
          allow: chains.map((c: any) => c.chainId),
        },
      });
      setAvailableChains(chains.map((c: any) => c.chainId));
    } else {
      setConfig({
        ...(config ?? {}),
        isDefaultValueEnabled: true,
      });
    }
  };

  return (
    <Card>
      <CardRowContainer>
        <CardTitleContainer>
          <CardValue>Default chain and token</CardValue>
        </CardTitleContainer>
        <Switch
          checked={!!(config && config.isDefaultValueEnabled)}
          onChange={handleDefaultValueEnabled}
          aria-label="Enable default chain and token"
        />
      </CardRowContainer>
      <Collapse in={!!(config && config.isDefaultValueEnabled)}>
        {/* Available chains multi-select dropdown */}
        <CardRowContainer>
          <Autocomplete
            slotProps={{
                popper: {
                sx: { zIndex: 2000 }
                }
            }}
            sx={{width: '100%' }}
            multiple
            disableCloseOnSelect
            options={chains}
            value={chains.filter(chain => availableChains.includes(chain.chainId))}
            getOptionLabel={(option) => option.name || String(option.chainId) || ''}
            onChange={(_, newValue) => {
              setAvailableChains(newValue.map((c: any) => c.chainId));
            }}
            isOptionEqualToValue={(option, value) => String(option.chainId) === String(value.chainId)}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option.name}
              </li>
            )}
            renderTags={() => null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Available Chains"
                placeholder="Select Chains"
                error={!!chainError}
                helperText={chainError}
              />
            )}
          />
        </CardRowContainer>
        {/* Default chain dropdown, only show available chains */}
        <CardRowContainer>
          <Autocomplete
            slotProps={{
                popper: {
                sx: { zIndex: 2000 }
                }
            }}
            sx={{width: '100%' }}
            options={chains.filter(chain => availableChains.includes(chain.chainId))}
            getOptionLabel={(option) => option.name || String(option.chainId) || ''}
            value={chains.find(chain => String(chain.chainId) === String(config?.defaultChain)) || null}
            onChange={(_, newValue) => {
              if (!newValue) return;
              setTokens([]);
              setConfig({
                ...(config ?? {}),
                defaultChain: newValue.chainId,
                defaultFromToken: '',
                defaultToToken: '',
              });
            }}
            loading={chainLoading}
            disabled={chainLoading}
            isOptionEqualToValue={(option, value) => String(option.chainId) === String(value.chainId)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Chain"
                placeholder="Select Chain"
                error={!!chainError}
                helperText={chainError}
              />
            )}
          />
        </CardRowContainer>
        <CardRowContainer>
          <Autocomplete
            slotProps={{
                popper: {
                sx: { zIndex: 2000 }
                }
            }}
            sx={{width: '100%' }}
            options={tokens}
            getOptionLabel={(option) => option.symbol || ''}
            filterOptions={(options, { inputValue }) =>{
                let arr =options.filter(
                    (token) =>
                      token.symbol?.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  return arr
            }}
            value={tokens.find(token => token.address === config?.defaultFromToken) || null}
            onChange={(_, newValue) => {
              setConfig({
                ...(config ?? {}),
                defaultFromToken: newValue ? newValue.address : '',
              });
            }}
            loading={tokenLoading}
            disabled={tokenLoading || !config?.defaultChain}
            isOptionEqualToValue={(option, value) => option.address === value.address}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select From Token"
                placeholder="Select Token"
                error={!!tokenError}
                helperText={tokenError}
              />
            )}
          />
        </CardRowContainer>
        <CardRowContainer>
          <Autocomplete
            slotProps={{
                popper: {
                sx: { zIndex: 2000 }
                }
            }}
            sx={{width: '100%' }}
            options={tokens}
            getOptionLabel={(option) => option.symbol || ''}
            filterOptions={(options, { inputValue }) => options.filter(
                (token) =>
                  token.symbol?.toLowerCase().includes(inputValue.toLowerCase())
              )
            }
            value={tokens.find(token => token.address === config?.defaultToToken) || null}
            onChange={(_, newValue) => {
              setConfig({
                ...(config ?? {}),
                defaultToToken: newValue ? newValue.address : '',
              });
            }}
            loading={tokenLoading}
            disabled={tokenLoading || !config?.defaultChain}
            isOptionEqualToValue={(option, value) => option.address === value.address}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select To Token"
                placeholder="Select Token"
                error={!!tokenError}
                helperText={tokenError}
              />
            )}
          />
        </CardRowContainer>
      </Collapse>
    </Card>
  );
}
