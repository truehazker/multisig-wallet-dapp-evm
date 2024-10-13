import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';
import { isAddress } from 'viem';
import { FC } from 'react';

interface OwnersInputProps {
  owners: string[];
  updateOwner: (index: number, value: string) => void;
  removeOwner: (index: number) => void;
  addOwner: () => void;
}

export const OwnersInput: FC<OwnersInputProps> = ({
                                                    owners,
                                                    updateOwner,
                                                    removeOwner,
                                                    addOwner
                                                  }) => {
  return (
    <>
      {owners.map((owner, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder={`Owner ${index + 1}`}
            value={owner}
            onChange={(e) => updateOwner(index, e.target.value)}
            className={!isAddress(owner) && owner !== '' ? 'border-red-500' : ''}
            disabled={index === 0}
          />
          {owners.length <= 2 || index === 0 ? null : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeOwner(index)}
            >
              <X className="h-4 w-4"/>
            </Button>
          )}
        </div>
      ))}
      <Button variant="outline" className="w-full" onClick={addOwner}>
        <Plus className="h-4 w-4 mr-2"/> Add Owner
      </Button>
    </>
  );
};
