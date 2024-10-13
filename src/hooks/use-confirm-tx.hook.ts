import { useWriteContract } from 'wagmi';
import { toast } from 'sonner';
import { MULTISIG_WALLET_ABI } from '@/const/contract.const';
import { useStore } from '@/const/local-storage.const';

export const useConfirmTx = () => {
  const { activeContract } = useStore();

  const {
    data: confirmTxHash,
    isPending: confirmTxIsPending,
    writeContract: confirmTxWriteContract,
    isSuccess: confirmTxSuccess,
    isError: confirmTxIsError,
    error: confirmTxErrorData
  } = useWriteContract({
    mutation: {
      onSuccess: () => toast.success('Transaction successful'),
      onError: (error) => {
        console.error('Confirmation error:', error);
        toast.error('Something went wrong, please try again');
      }
    }
  });

  const writeContract = ({ txId }: {
    txId: number;
  }) => {
    if (!activeContract?.contractAddress) {
      toast.error('No active contract address');
      return;
    }

    return confirmTxWriteContract({
      abi: MULTISIG_WALLET_ABI,
      address: activeContract.contractAddress,
      functionName: 'confirmTransaction',
      args: [BigInt(txId)]
    });
  };

  return {
    confirmTxHash,
    confirmTxIsPending,
    confirmTxWriteContract: writeContract,
    confirmTxSuccess,
    confirmTxIsError,
    confirmTxErrorData
  };
};