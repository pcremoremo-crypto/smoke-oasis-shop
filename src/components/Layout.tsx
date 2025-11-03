import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { WhatsAppButton } from "./WhatsAppButton";

export const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <WhatsAppButton />
    </>
  );
};
