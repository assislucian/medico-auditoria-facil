
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComparisonTable from "./ComparisonTable";

interface ComparisonDetail {
  id: string;
  codigo: string;
  descricao: string;
  qtd: number;
  valorCbhpm: number;
  valorPago: number;
  diferenca: number;
  status: string;
  papel: string;
}
interface Summary {
  total: number;
  conforme: number;
  abaixo: number;
  acima: number;
}

interface CBHPMComparisonTabsProps {
  roles: string[];
  filteredDetails: ComparisonDetail[];
  getStatusBadge: (status: string) => React.ReactNode;
  getRoleBadge: (role: string) => React.ReactNode;
  toggleSort: (field: string) => void;
  sortField: string | null;
  getSortIcon: (field: string) => React.ReactNode;
  filter: string;
  filteredSummary: { total: number; [x: string]: number };
}

const CBHPMComparisonTabs: React.FC<CBHPMComparisonTabsProps> = ({
  roles,
  filteredDetails,
  getStatusBadge,
  getRoleBadge,
  toggleSort,
  sortField,
  getSortIcon,
  filter,
  filteredSummary
}) => (
  <Tabs defaultValue="all" className="w-full">
    <TabsList className="mb-2 flex overflow-auto">
      <TabsTrigger value="all">
        Todos ({filteredSummary.total})
      </TabsTrigger>
      {roles.map(role => {
        const count = filteredDetails.filter(d => d.papel === role).length;
        return (
          <TabsTrigger key={role} value={role}>
            {role} ({count})
          </TabsTrigger>
        );
      })}
    </TabsList>
    <TabsContent value="all">
      <ComparisonTable
        details={filteredDetails}
        getStatusBadge={getStatusBadge}
        getRoleBadge={getRoleBadge}
        toggleSort={toggleSort}
        sortField={sortField}
        getSortIcon={getSortIcon}
        filter={filter}
      />
    </TabsContent>
    {roles.map(role => {
      const roleDetails = filteredDetails.filter(detail => detail.papel === role);
      return (
        <TabsContent key={role} value={role}>
          <ComparisonTable
            details={roleDetails}
            getStatusBadge={getStatusBadge}
            getRoleBadge={getRoleBadge}
            toggleSort={toggleSort}
            sortField={sortField}
            getSortIcon={getSortIcon}
            filter={filter}
          />
        </TabsContent>
      );
    })}
  </Tabs>
);

export default CBHPMComparisonTabs;
