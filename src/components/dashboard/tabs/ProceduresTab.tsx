
import { useState } from "react";
import { ProceduresGrid } from "./grids/ProceduresGrid";

const ProceduresTab = () => {
  const [procedures] = useState<any[]>([]);  // We'll integrate this with real data later

  return <ProceduresGrid procedures={procedures} />;
};

export default ProceduresTab;
