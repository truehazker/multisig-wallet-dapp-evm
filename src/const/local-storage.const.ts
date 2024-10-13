import { Address } from 'viem';
import { create } from 'zustand';
import {
  persist,
  PersistStorage
} from 'zustand/middleware';
import superjson from 'superjson';

export interface IContract {
  contractAddress: Address;
  owners: Address[];
  threshold: bigint;
}

interface IStore {
  contractsHistory: IContract[];
  activeContract: IContract | null;
  appendContractsHistory: (contract: IContract) => void;
  setActiveContract: (contract: IContract | null) => void;
  setState: (newState: Partial<IStore>) => void;
}

const storage: PersistStorage<IStore> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return superjson.parse(str);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, superjson.stringify(value));
  },
  removeItem: (name) => localStorage.removeItem(name)
};

export const useStore = create<IStore>()(
  persist(
    (set) => ({
      contractsHistory: [],
      activeContract: null,
      appendContractsHistory: (contract) =>
        set((state) => ({ contractsHistory: [...state.contractsHistory, contract] })),
      setActiveContract: (contract) => set({ activeContract: contract }),
      setState: (newState) => set(newState)
    }),
    {
      name: 'app-storage',
      storage
    }
  )
);

// Functions to change storage outside of React components
export const appendContractsHistory = (contract: IContract) => useStore.getState().appendContractsHistory(contract);
export const setActiveContract = (contract: IContract | null) => useStore.getState().setActiveContract(contract);
export const getState = () => useStore.getState();
export const setState = (newState: Partial<IStore>) => useStore.getState().setState(newState);
