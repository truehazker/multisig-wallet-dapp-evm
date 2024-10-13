import { useDeployContract } from 'wagmi';
import { contractAbi, contractBytecode } from '@/const/contract.const.ts';
import { Address } from 'viem';

export const useDeployMultisigWallet = (owners: Address[], threshold: bigint) => {
  const { deployContract: legacyDeployContract, data } = useDeployContract();

  const deployContract = async () => {
    legacyDeployContract({
      abi: contractAbi,
      bytecode: contractBytecode,
      args: [owners, threshold]
    });
  };

  return {
    deployContract,
    data
  };
};
