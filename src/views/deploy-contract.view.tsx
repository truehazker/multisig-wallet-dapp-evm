import { useState, useCallback, useEffect, useMemo } from 'react';
import { Section } from '@/components/section.component.tsx';
import { Container } from '@/components/container.component.tsx';
import { useAccount } from 'wagmi';
import { LocalStorage } from '@/const/local-storage.const.ts';
import { Address, isAddress } from 'viem';
import {
  useDeployMultisigWallet
} from '@/hooks/use-deploy-multisig-wallet.hook.ts';
import {
  ConnectionNotice
} from '@/components/connection-notice.component.tsx';
import { OwnersInput } from '@/components/owners-input.component.tsx';
import { ThresholdInput } from '@/components/threshold-input.component.tsx';
import { DeploymentButton } from '@/components/deployment-button.component.tsx';
import { toast } from 'sonner';

export const DeployContractView = () => {
  const { isConnected, address } = useAccount();

  const [owners, setOwners] = useState<string[]>(['']);
  const [threshold, setThreshold] = useState<number>(1);

  // Custom hook for deploying contract
  const {
    deployContract,
    isLoading: deploymentLoading,
    error: deploymentError
  } =
    useDeployMultisigWallet({
      onSuccess: ({ contractAddress }) => {
        console.log('Contract deployed:', contractAddress);
        LocalStorage.setActiveContract(contractAddress);
        toast.success('Contract deployed successfully');
      },
      onError: (error) => {
        console.error('Deployment error:', error);
      }
    });

  // Update owners when account changes
  useEffect(() => {
    if (isConnected && address) {
      setOwners((prev) => [address, ...prev.filter((addr) => addr !== address)]);
    } else {
      setOwners((prev) => prev.filter((_, index) => index !== 0));
    }
  }, [isConnected, address]);

  // Ensure threshold is valid
  useEffect(() => {
    setThreshold((prev) => Math.min(Math.max(1, prev), owners.length));
  }, [owners.length]);

  const addOwner = useCallback(() => {
    setOwners((prev) => [...prev, '']);
  }, []);

  const removeOwner = useCallback((index: number) => {
    setOwners((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateOwner = useCallback((index: number, value: string) => {
    setOwners((prev) => prev.map((owner, i) => (i === index ? value : owner)));
  }, []);

  const validateOwners = useCallback(() => {
    const validAddresses = owners.filter((addr) => isAddress(addr));
    const uniqueAddresses = new Set(validAddresses);
    return validAddresses.length === owners.length && uniqueAddresses.size === owners.length;
  }, [owners]);

  const handleDeploy = useCallback(async () => {
    if (isConnected && validateOwners() && threshold > 0 && threshold <= owners.length) {
      await deployContract(owners as Address[], BigInt(threshold));
    } else {
      console.error('Invalid input or not connected');
    }
  }, [isConnected, owners, threshold, validateOwners, deployContract]);

  const isValid = useMemo(
    () =>
      isConnected &&
      validateOwners() &&
      threshold > 0 &&
      threshold <= owners.length &&
      owners.length >= 2,
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
              <ConnectionNotice/>
            ) : (
              <>
                <OwnersInput
                  owners={owners}
                  updateOwner={updateOwner}
                  removeOwner={removeOwner}
                  addOwner={addOwner}
                />
                <ThresholdInput
                  threshold={threshold}
                  setThreshold={setThreshold}
                  ownersCount={owners.length}
                  hasMinimumOwners={hasMinimumOwners}
                />
                <DeploymentButton
                  isValid={isValid}
                  isLoading={deploymentLoading}
                  handleDeploy={handleDeploy}
                />
                {!hasMinimumOwners && (
                  <p className="text-red-500 text-sm">At least two owners are
                    required.</p>
                )}
                {deploymentError && (
                  <p className="text-red-500 text-sm">Deployment
                    error: {deploymentError.message}</p>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};