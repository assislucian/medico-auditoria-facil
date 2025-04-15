
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import { HistorySearch } from "@/components/history/HistorySearch";
import { HistoryTable } from "@/components/history/HistoryTable";
import { mockHistory } from "@/components/history/data";

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  
  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || item.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Helmet>
        <title>Histórico de Análises | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={true} />
        <div className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-6">Histórico de Análises</h1>
          
          <HistorySearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
          
          <HistoryTable items={filteredHistory} />
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
