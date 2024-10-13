// components/ThresholdInput.tsx
import { Slider } from '@/components/ui/slider';
import { FC } from 'react';

interface ThresholdInputProps {
  threshold: number;
  setThreshold: (value: number) => void;
  ownersCount: number;
  hasMinimumOwners: boolean;
}

export const ThresholdInput: FC<ThresholdInputProps> = ({
                                                          threshold,
                                                          setThreshold,
                                                          ownersCount,
                                                          hasMinimumOwners
                                                        }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor="threshold" className="text-sm font-medium">
      Confirmations: {threshold} <span
      className={'text-white/50'}>/ {ownersCount}</span>
    </label>
    <Slider
      id="threshold"
      min={1}
      max={ownersCount}
      step={1}
      value={[threshold]}
      onValueChange={(value) => setThreshold(value[0])}
      disabled={!hasMinimumOwners}
    />
  </div>
);
