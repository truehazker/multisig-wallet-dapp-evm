import { http, createConfig } from 'wagmi';
import { hardhat, mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

export const config = createConfig(
  getDefaultConfig({
    appName: 'MultisigWallet',
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    chains: [mainnet, sepolia, hardhat],
    ssr: false,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [hardhat.id]: http()
    }
  })
);
