
import { useState } from "react";
import { PaymentStatementsGrid } from "./grids/PaymentStatementsGrid";
import { PaymentStatement } from "@/types/medical";

const PaymentStatementsTab = () => {
  const [payments] = useState<PaymentStatement[]>([]);  // We'll integrate this with real data later

  return <PaymentStatementsGrid payments={payments} />;
};

export default PaymentStatementsTab;
