
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { HistorySearch } from "@/components/history/HistorySearch";
import { HistoryTable } from "@/components/history/HistoryTable";
import { fetchHistoryData } from '@/services/historyService';
import { HistoryItem } from '@/components/history/data';
import { Loader2 } from 'lucide-react';

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  
  useEffect(() => {
    const loadHistoryData = async () => {
      setLoading(true);
      const data = await fetchHistoryData();
      setHistoryData(data);
      setLoading(false);
    };
    
    loadHistoryData();
  }, []);
  
  const filteredHistory = historyData.filter(item => {
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
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Carregando histórico...</span>
            </div>
          ) : (
            <HistoryTable items={filteredHistory} />
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
