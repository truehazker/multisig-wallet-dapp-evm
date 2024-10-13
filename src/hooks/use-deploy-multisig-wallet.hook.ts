import { useState, useCallback } from 'react';
import { MULTISIG_WALLET_ABI, MULTISIG_WALLET_BYTECODE } from '@/const/contract.const';
import { Address, Hash } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { config } from '@/const/wagmi-config.const';
import { useWalletClient } from 'wagmi';

interface UseDeployMultisigWalletOptions {
  onError?: (error: Error) => void;
  onSuccess?: (data: {
    contractAddress: Address,
    owners: Address[],
    threshold: bigint
  }) => void;
  onSettled?: () => void;
}

export const useDeployMultisigWallet = (options?: UseDeployMultisigWalletOptions) => {
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<Address | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const deployContract = useCallback(
    async (owners: Address[], threshold: bigint) => {
      setIsLoading(true);
      setError(null);
      setContractAddress(null);

      try {
        if (!walletClient) throw new Error('Wallet client not found');

        const deploymentTxHash = await walletClient.deployContract({
          abi: MULTISIG_WALLET_ABI,
          bytecode: MULTISIG_WALLET_BYTECODE,
          args: [owners, threshold]
        });

        const receipt = await waitForTransactionReceipt(config.getClient(), {
          hash: deploymentTxHash as Hash
        });

        if (!receipt.contractAddress) {
          throw new Error('Contract deployment failed');
        }

        setContractAddress(receipt.contractAddress);
        options?.onSuccess?.({
          contractAddress: receipt.contractAddress,
          owners,
          threshold,
        });
      } catch (err) {
        setError(err as Error);
        options?.onError?.(err as Error);
      } finally {
        setIsLoading(false);
        options?.onSettled?.();
      }
    },
    [walletClient, options]
  );

  return {
    deployContract,
    isLoading,
    error,
    contractAddress
  };
};