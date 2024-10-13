import { useReadContract } from 'wagmi';
import { MULTISIG_WALLET_ABI } from '@/const/contract.const.ts';
import { useStore } from '@/const/local-storage.const.ts';

export const useGetRequired = () => {
  const { activeContract } = useStore();

  const {
    data: required = BigInt(0),
    queryKey: getRequiredQueryKey
  } = useReadContract({
    abi: MULTISIG_WALLET_ABI,
    address: activeContract?.contractAddress,
    functionName: 'required'
  });

  return {
    required,
    getRequiredQueryKey
  };
};
