import { Outlet } from "react-router-dom";
import Navbar from "../PagesStrucure/NavbarStructure";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar/>
      {/* pt-16 makes room for the fixed navbar (h-16). Adjust if you change navbar height */}
      <main className="pt-16 min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;

