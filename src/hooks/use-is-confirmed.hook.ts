import { useReadContract } from 'wagmi';
import { MULTISIG_WALLET_ABI } from '@/const/contract.const.ts';
import { Address } from 'viem';
import { useStore } from '@/const/local-storage.const.ts';

export const useIsConfirmed = (txId: bigint, owner: Address) => {
  const { activeContract } = useStore();

  const {
    data: isConfirmed = false,
    queryKey: isConfirmedQueryKey
  } = useReadContract({
    abi: MULTISIG_WALLET_ABI,
    address: activeContract?.contractAddress,
    functionName: 'isConfirmed',
    args: [txId, owner]
  });

  return {
    isConfirmed,
    isConfirmedQueryKey
  };
};
