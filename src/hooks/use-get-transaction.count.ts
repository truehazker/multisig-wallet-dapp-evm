import { useReadContract } from 'wagmi';
import { contractAbi } from '@/const/contract.const.ts';
import { useStore } from '@/const/local-storage.const.ts';

export const useGetTransactionCount = () => {
  const { activeContract } = useStore();

  const {
    data: transactionCount = BigInt(0),
    queryKey: transactionCountQueryKey,
    refetch: refetchTransactionCount
  } = useReadContract({
    abi: contractAbi,
    address: activeContract?.contractAddress,
    functionName: 'getTransactionCount',
  });

  return {
    transactionCount,
    transactionCountNumber: Number(transactionCount),
    transactionCountQueryKey,
    refetchTransactionCount
  };
};
