import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.com' },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'StableFX Swap',
  projectId: '9defac1fe540054ea2bf58f8b34bf864', // Remplace par ton vrai ID
  chains: [arcTestnet],
  ssr: true,
});