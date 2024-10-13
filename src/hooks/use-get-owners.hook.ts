import { useReadContract } from 'wagmi';
import { MULTISIG_WALLET_ABI } from '@/const/contract.const.ts';
import { useStore } from '@/const/local-storage.const.ts';

export const useGetOwners = () => {
  const { activeContract } = useStore();

  const {
    data: owners = [],
    queryKey: getOwnersQueryKey
  } = useReadContract({
    abi: MULTISIG_WALLET_ABI,
    address: activeContract?.contractAddress,
    functionName: 'getOwners'
  });

  return {
    owners,
    getOwnersQueryKey
  };
};
