import { useReadContract } from 'wagmi';
import { MULTISIG_WALLET_ABI } from '@/const/contract.const.ts';
import { Address } from 'viem';
import { useStore } from '@/const/local-storage.const.ts';

export interface ITransaction {
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
    data: transaction = ['0x', '0x', BigInt(0), false, BigInt(0), '0x'],
    queryKey: getTransactionQueryKey
  } = useReadContract({
    abi: MULTISIG_WALLET_ABI,
    address: activeContract?.contractAddress,
    functionName: 'getTransaction',
    args: [txId]
  });

  // Convert the transaction data to a more readable format
  const [tokenAddress, to, value, executed, confirmations, data] = transaction;
  const transactionData: ITransaction = {
    tokenAddress,
    to,
    value,
    executed,
    confirmations,
    data
  };

  return {
    transaction: transactionData,
    getTransactionQueryKey
  };
};
