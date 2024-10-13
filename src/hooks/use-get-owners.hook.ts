import { useReadContract } from 'wagmi';
import { contractAbi } from '@/const/contract.const.ts';
import { useStore } from '@/const/local-storage.const.ts';

export const useGetOwners = () => {
  const { activeContract } = useStore();

  const {
    data: owners = [],
    queryKey: getOwnersQueryKey
  } = useReadContract({
    abi: contractAbi,
    address: activeContract?.contractAddress,
    functionName: 'getOwners'
  });

  return {
    owners,
    getOwnersQueryKey
  };
};
