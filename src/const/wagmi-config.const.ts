import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

export const config = createConfig(
  getDefaultConfig({
    appName: 'MultisigWallet',
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    chains: [mainnet, sepolia],
    ssr: false,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http()
    }
  })
);
