import { DeployContractView } from '@/views/deploy-contract.view.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { Container } from '@/components/container.component.tsx';
import { Section } from '@/components/section.component.tsx';
import { SelectContractView } from '@/views/select-contract.view.tsx';
import {
  ContractTransactionsView
} from '@/views/contract-transactions.view.tsx';
import { ProposeTransaction } from '@/views/propose-transaction.view.tsx';

function App() {
  return (
    <>
      <Section>
        <Container className={'!gap-2'}>
          <div className={'grid grid-cols-1 md:grid-cols-2 gap-2'}>
            <DeployContractView/>
            <SelectContractView/>
          </div>
          <div className={'grid grid-cols-1 md:grid-cols-2 gap-2'}>
            <ContractTransactionsView/>
            <ProposeTransaction/>
          </div>
        </Container>
      </Section>
      <Toaster/>
    </>
  );
}

export default App;
