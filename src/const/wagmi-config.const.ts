import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

export const config = createConfig(
  getDefaultConfig({
    appName: 'MultisigWallet',
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    chains: [mainnet /*goerli*/],
    ssr: true,
    transports: {
      [mainnet.id]: http()
      // [sepolia.id]: http(),
    }
  })
);
