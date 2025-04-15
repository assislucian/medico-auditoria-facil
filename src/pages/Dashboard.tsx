
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";

const DashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={true} />
        <div className="flex-1 container py-8">
          <Dashboard />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
