import { useReadContract } from 'wagmi';
import { contractAbi } from '@/const/contract.const.ts';
import { Address } from 'viem';

export const useGetTransactionCountHook = (tokenAddress: Address) => {
  const {
    data: transactionCount = BigInt(0),
    queryKey: transactionCountQueryKey
  } = useReadContract({
    abi: contractAbi,
    address: tokenAddress,
    functionName: 'getTransactionCount'
  });

  return {
    transactionCount,
    transactionCountQueryKey
  };
};
