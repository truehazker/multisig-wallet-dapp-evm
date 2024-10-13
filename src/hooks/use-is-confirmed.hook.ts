import { useReadContract } from 'wagmi';
import { contractAbi } from '@/const/contract.const.ts';
import { Address } from 'viem';
import { useStore } from '@/const/local-storage.const.ts';

export const useIsConfirmed = (txId: bigint, owner: Address) => {
  const { activeContract } = useStore();

  const {
    data: isConfirmed = false,
    queryKey: isConfirmedQueryKey
  } = useReadContract({
    abi: contractAbi,
    address: activeContract?.contractAddress,
    functionName: 'isConfirmed',
    args: [txId, owner]
  });

  return {
    isConfirmed,
    isConfirmedQueryKey
  };
};
