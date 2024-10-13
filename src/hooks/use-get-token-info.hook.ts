import { useReadContract } from 'wagmi';
import {
  ERC20_TOKEN_ABI
} from '@/const/contract.const.ts';
import { Address, zeroAddress } from 'viem';

export const useGetTokenInfo = (tokenAddress: Address) => {
  // if (tokenAddress === zeroAddress) {
  //   return {
  //     tokenDecimals: 18,
  //     tokenDecimalsQueryKey: '',
  //     tokenSymbol: 'ETH',
  //     tokenSymbolQueryKey: ''
  //   };
  // }

  const {
    data: tokenDecimals = 0,
    queryKey: tokenDecimalsQueryKey
  } = useReadContract({
    abi: ERC20_TOKEN_ABI,
    address: tokenAddress,
    functionName: 'decimals'
  });

  const {
    data: tokenSymbol = '',
    queryKey: tokenSymbolQueryKey
  } = useReadContract({
    abi: ERC20_TOKEN_ABI,
    address: tokenAddress,
    functionName: 'symbol'
  });

  if (tokenAddress === zeroAddress) {
    return {
      tokenDecimals: 18,
      tokenDecimalsQueryKey: '',
      tokenSymbol: 'ETH',
      tokenSymbolQueryKey
    };
  }

  return {
    tokenDecimals,
    tokenDecimalsQueryKey,
    tokenSymbol,
    tokenSymbolQueryKey
  };
};
