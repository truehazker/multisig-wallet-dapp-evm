import { useState } from 'react';
import {
  IContract,
  setActiveContract,
  useStore
} from '@/const/local-storage.const.ts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent, DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const shortenAddress = (address: string, digits = 4) => {
  return `${address.slice(0, digits + 2)}...${address.slice(-digits)}`;
};

const ContractDetailsModal = ({ contract, isOpen, onClose }: {
  contract: IContract | null,
  isOpen: boolean,
  onClose: () => void
}) => {
  if (!contract) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Contract address copied to clipboard'))
      .catch(() => toast.error('Failed to copy contract address'));
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Contract Details</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Details of the selected contract.
        </DialogDescription>
        <div className="grid gap-4 py-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Contract Address</TableCell>
                <TableCell className={'font-mono hover:font-bold'} onClick={() => handleCopy(contract.contractAddress)}>
                  {contract.contractAddress}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Owners</TableCell>
                <TableCell className={'flex flex-col gap-2'}>
                  {contract.owners.map((owner) => (
                    <div
                      key={owner}
                      className={'font-mono hover:font-bold'}
                      onClick={() => handleCopy(owner)}
                    >
                      {owner}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Threshold</TableCell>
                <TableCell>{contract.threshold.toString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ContractRow = ({ contract, isActive, onSelect, onShowDetails }: {
  contract: IContract,
  isActive: boolean,
  onSelect: (contract: IContract) => void,
  onShowDetails: (contract: IContract) => void
}) => {
  const handleContractCopy = (e: React.MouseEvent<HTMLTableCellElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(contract.contractAddress)
      .then(() => toast.success('Contract address copied to clipboard'))
      .catch(() => toast.error('Failed to copy contract address'))
      .finally(() => e.preventDefault());
  };

  return (
    <TableRow
      key={contract.contractAddress}
      className="cursor-pointer"
      onClick={() => onShowDetails(contract)}
    >
      <TableCell className="font-mono hover:font-bold"
                 onClick={handleContractCopy}>
        {shortenAddress(contract.contractAddress)}
      </TableCell>
      <TableCell>{contract.owners.length}</TableCell>
      <TableCell>{contract.threshold.toString()}</TableCell>
      <TableCell>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(contract);
          }}
          variant={isActive ? 'secondary' : 'default'}
          disabled={isActive}
        >
          {isActive ? 'Selected' : 'Select'}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const SelectContractView = () => {
  const { contractsHistory, activeContract } = useStore();
  const [selectedContract, setSelectedContract] = useState<IContract | null>(null);

  const handleSelectContract = (contract: IContract) => {
    setActiveContract(contract);
  };

  const handleShowDetails = (contract: IContract) => {
    setSelectedContract(contract);
  };

  return (
    <div className="border rounded-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Select a Contract</h2>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract Address</TableHead>
              <TableHead>Owners</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractsHistory.map((contract) => (
              <ContractRow
                key={contract.contractAddress}
                contract={contract}
                isActive={activeContract?.contractAddress === contract.contractAddress}
                onSelect={handleSelectContract}
                onShowDetails={handleShowDetails}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <ContractDetailsModal
        contract={selectedContract}
        isOpen={!!selectedContract}
        onClose={() => setSelectedContract(null)}
      />
    </div>
  );
};