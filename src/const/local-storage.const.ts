import { Store } from '@tanstack/react-store';

interface IStore {
  contractsHistory: string[];    // History of deployed or attached contracts
  activeContract: string | null; // Active contract
}

const store = new Store<IStore>({
  contractsHistory: [],
  activeContract: null
});

export class LocalStorage {
  static getContractsHistory(): string[] {
    return store.state.contractsHistory;
  }

  static setContractsHistory(value: string[]) {
    store.setState((state) => {
      return {
        ...state,
        contractsHistory: value
      };
    });
  }

  static getActiveContract(): string | null {
    return store.state.activeContract;
  }

  static setActiveContract(value: string | null) {
    store.setState((state) => {
      return {
        ...state,
        activeContract: value
      };
    });
  }

  static getState(): IStore {
    return store.state;
  }

  static setState(value: IStore) {
    store.setState((state) => {
      return {
        ...state,
        ...value
      };
    });
  }
}
