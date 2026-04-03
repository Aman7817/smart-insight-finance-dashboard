import TransactionFilters from "./TransactionFilters";
import TransactionList from "./TransactionList";

export default function Transactions() {
  return (
    <div className="space-y-5">
      <TransactionFilters />
      <TransactionList />
    </div>
  );
}