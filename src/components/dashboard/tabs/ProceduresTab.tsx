
import { useState } from "react";
import { ProceduresGrid } from "./grids/ProceduresGrid";
import { Procedure } from "@/types/medical";

const ProceduresTab = () => {
  const [procedures] = useState<Procedure[]>([]);  // We'll integrate this with real data later

  return <ProceduresGrid procedures={procedures} />;
};

export default ProceduresTab;
