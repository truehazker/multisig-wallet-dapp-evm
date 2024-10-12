import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import '@/assets/styles/index.css';
import { ThemeProvider } from './components/theme-provider.component';
import { WagmiProvider } from 'wagmi';
import { config } from '@/const/wagmi-config.const.ts';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
            <App/>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </StrictMode>
);
