import { useGetTransactionCount } from '@/hooks/use-get-transaction.count.ts';
import {
  ITransaction,
  useGetTransaction
} from '@/hooks/use-get-transaction.hook.ts';
import { useIsConfirmed } from '@/hooks/use-is-confirmed.hook.ts';
import { useAccount, useBlockNumber } from 'wagmi';
import { useEffect } from 'react';
import { queryClient } from '@/main.tsx';
import { useConfirmTx } from '@/hooks/use-confirm-tx.hook.ts';
import { Button } from '@/components/ui/button.tsx';
import { useGetOwners } from '@/hooks/use-get-owners.hook.ts';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Address } from 'viem';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const TransactionStatus = ({ executed, isConfirmed }: {
  executed: boolean,
  isConfirmed: boolean
}) => {
  let outerColor = executed ? 'bg-green-400' : isConfirmed ? 'bg-green-400' : 'bg-blue-400';
  let innerColor = executed ? 'bg-green-500' : isConfirmed ? 'bg-green-500' : 'bg-blue-500';

  return (
    <span className="relative flex h-3 w-3 mr-2">
      {!executed && (
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${outerColor} opacity-75`}></span>
      )}
      <span
        className={`relative inline-flex rounded-full h-3 w-3 ${innerColor}`}></span>
    </span>
  );
};

const TransactionDetails = ({
                              transaction,
                              isConfirmed,
                              owners,
                              handleConfirmTx
                            }: {
  transaction: ITransaction,
  isConfirmed: boolean,
  owners: readonly Address[],
  handleConfirmTx: () => void
}) => (
  <div className="flex flex-col gap-4">
    <table className="w-full border-collapse">
      <tbody>
      <tr>
        <td className="font-semibold pr-4 py-2">Token Address:</td>
        <td>{transaction.tokenAddress}</td>
      </tr>
      <tr>
        <td className="font-semibold pr-4 py-2">To:</td>
        <td>{transaction.to}</td>
      </tr>
      <tr>
        <td className="font-semibold pr-4 py-2">Value:</td>
        <td>{transaction.value.toString()} ETH</td>
      </tr>
      <tr>
        <td className="font-semibold pr-4 py-2">Executed:</td>
        <td>{transaction.executed ? 'Yes' : 'No'}</td>
      </tr>
      <tr>
        <td className="font-semibold pr-4 py-2">Confirmations:</td>
        <td>{transaction.confirmations.toString()} <span
          className="text-white/50">/ {owners.length}</span></td>
      </tr>
      <tr>
        <td className="font-semibold pr-4 py-2">Data:</td>
        <td className="break-all">{transaction.data}</td>
      </tr>
      <tr>
        <td className="font-semibold pr-4 py-2">Confirmed:</td>
        <td>{isConfirmed ? 'Yes' : 'No'}</td>
      </tr>
      </tbody>
    </table>
    <Button onClick={handleConfirmTx} disabled={isConfirmed}>
      Confirm Transaction
    </Button>
  </div>
);

export const Transaction = ({ id }: { id: number }) => {
  const { address } = useAccount();
  const { transaction } = useGetTransaction(BigInt(id));
  const { isConfirmed } = useIsConfirmed(BigInt(id), address || '0x');
  const { confirmTxWriteContract } = useConfirmTx();
  const { owners } = useGetOwners();

  const handleConfirmTx = () => {
    confirmTxWriteContract({ txId: id });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableRow className="cursor-pointer">
          <TableCell>
            <TransactionStatus
              executed={transaction.executed}
              isConfirmed={isConfirmed}
            />
          </TableCell>
          <TableCell>{id}</TableCell>
          <TableCell>{transaction.value.toString()} ETH</TableCell>
          <TableCell>
            {transaction.confirmations.toString()}
            <span className="text-white/50"> / {owners.length}</span>
          </TableCell>
        </TableRow>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[720px]">
        <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
        <TransactionDetails
          transaction={transaction}
          isConfirmed={isConfirmed}
          owners={owners}
          handleConfirmTx={handleConfirmTx}
        />
      </DialogContent>
    </Dialog>
  );
};

export const ContractTransactionsView = () => {
  const {
    transactionCountNumber,
    transactionCountQueryKey
  } = useGetTransactionCount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    if (blockNumber)
      queryClient.invalidateQueries({ queryKey: transactionCountQueryKey });
  }, [blockNumber, queryClient]);

  return (
    <div className="w-full border rounded p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">List of Transactions</h2>
      <p className="mb-4">Number of Transactions: {transactionCountNumber}</p>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Tx ID</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Confirmations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: transactionCountNumber }).map((_, i) => (
              <Transaction id={transactionCountNumber - 1 - i} key={i}/>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};