import { useWriteContract } from 'wagmi';
import { Address, Hex } from 'viem';
import { toast } from 'sonner';
import { contractAbi } from '@/const/contract.const';
import { useStore } from '@/const/local-storage.const';

export const useProposeTx = () => {
  const { activeContract } = useStore();

  const {
    data: proposalHash,
    isPending: proposalIsPending,
    writeContract: proposalWriteContract,
    isSuccess: proposalSuccess,
    isError: proposalIsError,
    error: proposalErrorData
  } = useWriteContract({
    mutation: {
      onSuccess: () => toast.success('Transaction successful'),
      onError: (error) => {
        console.error('Proposal error:', error);
        toast.error('Something went wrong, please try again');
      }
    }
  });

  const writeContract = ({ tokenAddress, to, value, data }: {
    tokenAddress: Address;
    to: Address;
    value: bigint;
    data: Hex;
  }) => {
    if (!activeContract?.contractAddress) {
      toast.error('No active contract address');
      return;
    }

    return proposalWriteContract({
      abi: contractAbi,
      address: activeContract.contractAddress,
      functionName: 'submitTransaction',
      args: [tokenAddress, to, value, data]
    });
  };

  return {
    proposalHash,
    proposalIsPending,
    proposalWriteContract: writeContract,
    proposalSuccess,
    proposalIsError,
    proposalErrorData
  };
};