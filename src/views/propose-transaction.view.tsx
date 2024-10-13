import { useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useProposeTx } from '@/hooks/use-propose-tx.hook.ts';
import { Address, isAddress, zeroAddress } from 'viem';

export const ProposeTransaction = () => {
  const { proposalWriteContract, proposalIsPending } = useProposeTx();
  const [formData, setFormData] = useState({
    tokenAddress: '',
    to: '',
    value: ''
  });
  const [errors, setErrors] = useState({
    tokenAddress: '',
    to: '',
    value: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    validateField(id, value);
  };

  const validateField = (field: string, value: string) => {
    let errorMessage = '';
    switch (field) {
      case 'tokenAddress':
        if (!isAddress(value) && value !== zeroAddress) {
          errorMessage = 'Invalid Ethereum address';
        }
        break;
      case 'to':
        if (!isAddress(value)) {
          errorMessage = 'Invalid Ethereum address';
        }
        break;
      case 'value':
        if (isNaN(Number(value)) || Number(value) < 0) {
          errorMessage = 'Must be a non-negative number';
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  const handleProposeTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error !== '')) {
      return;
    }
    proposalWriteContract({
      tokenAddress: formData.tokenAddress as Address,
      to: formData.to as Address,
      value: BigInt(formData.value),
      data: '0x'
    });
    // Reset form after successful submission
    // setFormData({ tokenAddress: '', to: '', value: '' });
  };

  return (
    <div className="w-full flex flex-col gap-4 border rounded p-6">
      <h2 className="text-xl font-bold">Propose Transaction</h2>
      <form onSubmit={handleProposeTx} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="tokenAddress">Token Address</Label>
          <Input
            id="tokenAddress"
            type="text"
            value={formData.tokenAddress}
            onChange={handleInputChange}
            aria-invalid={!!errors.tokenAddress}
            aria-describedby="tokenAddress-error"
          />
          {errors.tokenAddress && (
            <p id="tokenAddress-error" className="text-red-500 text-sm mt-1">
              {errors.tokenAddress}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            type="text"
            value={formData.to}
            onChange={handleInputChange}
            aria-invalid={!!errors.to}
            aria-describedby="to-error"
          />
          {errors.to && (
            <p id="to-error" className="text-red-500 text-sm mt-1">
              {errors.to}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="text"
            value={formData.value}
            onChange={handleInputChange}
            aria-invalid={!!errors.value}
            aria-describedby="value-error"
          />
          {errors.value && (
            <p id="value-error" className="text-red-500 text-sm mt-1">
              {errors.value}
            </p>
          )}
        </div>

        <Button type="submit"
                disabled={proposalIsPending || Object.values(errors).some((error) => error !== '')}>
          {proposalIsPending ? 'Proposing...' : 'Propose Transaction'}
        </Button>
      </form>
    </div>
  );
};