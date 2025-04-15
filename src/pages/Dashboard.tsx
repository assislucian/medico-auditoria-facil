
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import Dashboard from "@/components/Dashboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const DashboardPage = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Helmet>
        <title>Dashboard | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex">
        {isMobile ? (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="fixed top-3 left-3 z-50">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SideNav />
              </SheetContent>
            </Sheet>
            <div className="flex-1">
              <div className="pt-16 px-4 pb-4">
                <Dashboard />
              </div>
            </div>
          </>
        ) : (
          <>
            <SideNav className="w-64 border-r fixed top-0 bottom-0" />
            <div className="flex-1 ml-64">
              <div className="p-8">
                <Dashboard />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
