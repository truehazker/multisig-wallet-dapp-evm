import { useReadContract } from 'wagmi';
import { contractAbi } from '@/const/contract.const.ts';
import { useStore } from '@/const/local-storage.const.ts';

export const useGetTransactionCountHook = () => {
  const { activeContract } = useStore();

  const {
    data: transactionCount = BigInt(0),
    queryKey: transactionCountQueryKey
  } = useReadContract({
    abi: contractAbi,
    address: activeContract?.contractAddress,
    functionName: 'getTransactionCount'
  });

  return {
    transactionCount,
    transactionCountQueryKey
  };
};
