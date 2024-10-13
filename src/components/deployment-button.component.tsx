// components/DeploymentButton.tsx
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { FC } from 'react';

interface DeploymentButtonProps {
  isValid: boolean;
  isLoading: boolean;
  handleDeploy: () => void;
}

export const DeploymentButton: FC<DeploymentButtonProps> = ({
                                                              isValid,
                                                              isLoading,
                                                              handleDeploy
                                                            }) => (
  <Button className="w-fit gap-2" onClick={handleDeploy}
          disabled={!isValid || isLoading}>
    {isLoading ? (
      <>
        Deploying <LoaderCircle className="h-5 w-5 animate-spin"/>
      </>
    ) : (
      'Deploy'
    )}
  </Button>
);
