import { useReadContract } from 'wagmi';
import { contractAbi } from '@/const/contract.const.ts';
import { Address } from 'viem';
import { useStore } from '@/const/local-storage.const.ts';

interface ITransaction {
  tokenAddress: Address;
  to: Address;
  value: bigint;
  executed: boolean;
  confirmations: bigint;
  data: string;
}

export const useGetTransaction = (txId: bigint) => {
  const { activeContract } = useStore();

  const {
    data: transaction = {} as ITransaction,
    queryKey: getTransactionQueryKey
  } = useReadContract({
    abi: contractAbi,
    address: activeContract?.contractAddress,
    functionName: 'getTransaction',
    args: [txId]
  });

  return {
    transaction,
    getTransactionQueryKey
  };
};
