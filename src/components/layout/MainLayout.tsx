
import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  showSideNav?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
}

export function MainLayout({
  children,
  title,
  description,
  showSideNav = true,
  isLoading = false,
  loadingMessage,
}: MainLayoutProps) {
  return (
    <>
      <Helmet>
        <title>{`${title} | MedCheck`}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>

      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          {showSideNav && <AppSidebar />}
          
          <main className="flex-1">
            <div className="p-4">
              <div className="flex items-center gap-4 mb-8">
                <SidebarTrigger />
                <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              </div>
              
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}
