import { useState, useCallback, useEffect, useMemo } from 'react';
import { Section } from '@/components/section.component.tsx';
import { Container } from '@/components/container.component.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { Address, Hash, isAddress } from 'viem';
import { X, Plus, LoaderCircle } from 'lucide-react';
import { useAccount, useDeployContract } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { contractAbi, contractBytecode } from '@/const/contract.const.ts';
import { waitForTransactionReceipt } from 'viem/actions';
import { config } from '@/const/wagmi-config.const.ts';
import { LocalStorage } from '@/const/local-storage.const.ts';

export const DeployContractView = () => {
  const [deploymentLoading, setDeploymentLoading] = useState(false);
  const { deployContract, data: deploymentTx } = useDeployContract();
  const { isConnected, address } = useAccount();

  const [owners, setOwners] = useState<string[]>([]);
  const [threshold, setThreshold] = useState<number>(1);

  useEffect(() => {
    const waitForDeployment = async () => {
      const data = await waitForTransactionReceipt(config.getClient(), { hash: deploymentTx as Hash });
      if (!data.contractAddress) {
        console.error('Contract deployment failed:', data);
        return;
      } else if (data.contractAddress) {
        console.log('Contract deployed:', data.contractAddress);
        LocalStorage.setActiveContract(data.contractAddress);
      } else {
        console.error('Invalid transaction data:', data);
      }
    };

    if (deploymentTx) {
      waitForDeployment()
        .catch((e) => console.error('Error waiting for deployment:', e))
        .finally(() => setDeploymentLoading(false));
    }
  }, [deploymentTx]);

  useEffect(() => {
    if (isConnected && address) {
      const [_, ...rest] = owners;
      setOwners([address, ...rest]);
    } else {
      setOwners((prev) => (prev.length > 0 ? prev.slice(1) : prev));
    }
  }, [isConnected, address]);

  useEffect(() => {
    setThreshold((prev) => Math.min(Math.max(1, prev), owners.length));
  }, [owners.length]);

  const addOwner = useCallback(() => {
    setOwners((prev) => [...prev, '']);
  }, []);

  const removeOwner = useCallback((index: number) => {
    setOwners((prev) => {
      const newOwners = prev.filter((_, i) => i !== index);
      return newOwners.length < 2 ? prev : newOwners;
    });
  }, []);

  const updateOwner = useCallback((index: number, value: string) => {
    setOwners((prev) => prev.map((owner, i) => (i === index ? value : owner)));
  }, []);

  const validateOwners = useCallback(() => {
    const validAddresses = owners.filter((address) => isAddress(address));
    const uniqueAddresses = new Set(validAddresses);
    return validAddresses.length === owners.length && uniqueAddresses.size === owners.length;
  }, [owners]);

  const handleDeploy = useCallback(() => {
    if (isConnected && validateOwners() && threshold > 0 && threshold <= owners.length) {
      console.log('Deploy contract with:', owners, threshold);

      deployContract({
        abi: contractAbi,
        bytecode: contractBytecode,
        args: [owners as Address[], BigInt(threshold)]
      });

      setDeploymentLoading(true);
    } else {
      console.error('Invalid input or not connected');
    }
  }, [isConnected, owners, threshold, validateOwners]);

  const isValid = useMemo(
    () => isConnected && validateOwners() && threshold > 0 && threshold <= owners.length && owners.length >= 2,
    [isConnected, owners, threshold, validateOwners]
  );

  const hasMinimumOwners = useMemo(() => owners.length >= 2, [owners]);

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 border rounded p-6">
            <h2 className="text-xl font-bold">Deploy new MultisigWallet</h2>
            {!isConnected ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-red-500">Please connect your wallet to deploy
                  a contract.</p>
                <ConnectKitButton/>
              </div>
            ) : (
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOwner(index)}
                      disabled={owners.length <= 2 || index === 0}
                    >
                      <X className="h-4 w-4"/>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full"
                        onClick={addOwner}>
                  <Plus className="h-4 w-4 mr-2"/> Add Owner
                </Button>
                <div className="flex flex-col gap-2">
                  <label htmlFor="threshold" className="text-sm font-medium">
                    Threshold: {threshold} / {owners.length}
                  </label>
                  <Slider
                    id="threshold"
                    min={1}
                    max={owners.length}
                    step={1}
                    value={[threshold]}
                    onValueChange={(value) => setThreshold(value[0])}
                    disabled={!hasMinimumOwners}
                  />
                </div>
                <Button
                  className="w-fit gap-2"
                  onClick={handleDeploy}
                  disabled={!isValid || deploymentLoading}
                >
                  {deploymentLoading ? (
                    <>Deploying <LoaderCircle className="h-5 w-5 animate-spin"/></>
                  ) : (
                    <>Deploy</>
                  )}
                </Button>
                {!hasMinimumOwners && (
                  <p className="text-red-500 text-sm">At least two owners are
                    required.</p>
                )}
                {deploymentTx && (
                  <p className="text-green-500 text-sm">
                    Contract deployed: {deploymentTx}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};
