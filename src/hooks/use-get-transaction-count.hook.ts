import { useReadContract } from 'wagmi';
import { MULTISIG_WALLET_ABI } from '@/const/contract.const.ts';
import { useStore } from '@/const/local-storage.const.ts';

export const useGetTransactionCountHook = () => {
  const { activeContract } = useStore();

  const {
    data: transactionCount = BigInt(0),
    queryKey: transactionCountQueryKey,
    refetch: refetchTransactionCount
  } = useReadContract({
    abi: MULTISIG_WALLET_ABI,
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
