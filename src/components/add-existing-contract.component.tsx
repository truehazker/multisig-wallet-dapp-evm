import { useState } from 'react';
import { Address, isAddress } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IContract, useStore } from '@/const/local-storage.const';
import { toast } from 'sonner';
import { useGetMultisigWallet } from '@/hooks/use-get-multisig-wallet.hook.ts';

export const AddExistingContract = () => {
  const [contractAddress, setContractAddress] = useState<Address | null>(null);
  const { appendContractsHistory, setActiveContract } = useStore();
  const { owners, required } = useGetMultisigWallet(contractAddress || '0x0');

  const handleAddContract = () => {
    if (!contractAddress) {
      toast.error('Contract address is required');
      return;
    }

    if (!isAddress(contractAddress.toString())) {
      toast.error('Invalid contract address');
      return;
    }

    if (!owners || !required) {
      toast.error('Failed to fetch contract data');
      return;
    }

    const newContract: IContract = {
      contractAddress: contractAddress,
      owners: owners as Address[],
      threshold: required
    };

    setActiveContract(newContract);
    appendContractsHistory(newContract);

    toast.success('Contract added successfully');
  };

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="contractAddress">Existing Contract Address</Label>
      <Input
        id="contractAddress"
        value={contractAddress?.toString() || ''}
        onChange={(e) => setContractAddress(e.target.value as Address)}
        placeholder="0x..."
      />
      <Button onClick={handleAddContract}
              disabled={(contractAddress && !isAddress(contractAddress.toString())) || !owners || !required}>
        Add Existing Contract
      </Button>
    </div>
  );
};
