import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { AppSidebar } from "./Sidebar";
import { SidebarProvider, SidebarInset } from "./ui/sidebar";
import { WhatsAppButton } from "./WhatsAppButton";

export const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <main className="pt-16">
          <Outlet />
        </main>
        <WhatsAppButton />
      </SidebarInset>
    </SidebarProvider>
  );
};
