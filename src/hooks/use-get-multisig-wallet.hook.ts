import { useReadContract } from 'wagmi';
import { MULTISIG_WALLET_ABI } from '@/const/contract.const.ts';
import { Address } from 'viem';

export const useGetMultisigWallet = (
  walletAddress: Address
) => {
  const {
    data: required = BigInt(0),
    queryKey: getRequiredQueryKey
  } = useReadContract({
    abi: MULTISIG_WALLET_ABI,
    address: walletAddress,
    functionName: 'required'
  });

  const {
    data: owners = [],
    queryKey: getOwnersQueryKey
  } = useReadContract({
    abi: MULTISIG_WALLET_ABI,
    address: walletAddress,
    functionName: 'getOwners'
  });

  return {
    required,
    getRequiredQueryKey,

    owners,
    getOwnersQueryKey
  };
};
