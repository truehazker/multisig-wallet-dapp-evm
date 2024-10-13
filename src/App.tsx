import { DeployContractView } from '@/views/deploy-contract.view.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { Container } from '@/components/container.component.tsx';
import { Section } from '@/components/section.component.tsx';
import { SelectContractView } from '@/views/select-contract.view.tsx';
import {
  ContractTransactionsView
} from '@/views/contract-transactions.view.tsx';

function App() {
  return (
    <>
      <Section>
        <Container>
          <div className={'grid grid-cols-1 md:grid-cols-2 gap-8'}>
            <DeployContractView/>
            <SelectContractView/>
          </div>
          <div className={'grid grid-cols-1 md:grid-cols-2 gap-8'}>
            <ContractTransactionsView/>
          </div>
        </Container>
      </Section>
      <Toaster/>
    </>
  );
}

export default App;
