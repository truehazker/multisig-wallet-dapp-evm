import { ConnectKitButton } from 'connectkit';

export const ConnectionNotice = () => (
  <div className="flex flex-col items-center gap-4">
    <p className="text-red-500">
      Please connect your wallet to deploy a contract.
    </p>
    <ConnectKitButton />
  </div>
);