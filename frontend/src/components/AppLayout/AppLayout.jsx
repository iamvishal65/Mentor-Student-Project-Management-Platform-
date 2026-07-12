import { Outlet } from "react-router-dom";
import Navbar from "../PagesStrucure/NavbarStructure";

const Layout = () => {
  return (
    <div className="h-screen overflow-hidden">
      <Navbar />

      <main className="h-[calc(100vh-4rem)] pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
