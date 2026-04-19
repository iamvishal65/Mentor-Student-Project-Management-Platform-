import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/authApi";
import { userData } from "../../recoil/UserData";
import { useRecoilState } from "recoil";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [data, setData] = useRecoilState(userData);
  const navigate = useNavigate();

  const navLinks = {
    user: [
      { label: "Home", path: "/" },
      { label: "All Projects", path: "/allProject" },
    ],
    STUDENT: [
      { label: "Home", path: "/" },
      { label: "My Projects", path: "/myProject" },
      { label: "All Projects", path: "/allProject" },
      { label: "Ask Mentor", path: "/chatPage" },
    ],
    MENTOR: [
      { label: "Home", path: "/" },
      { label: "All Projects", path: "/allProject" },
      { label: "Messages", path: "/messages" },
    ],
    admin: [
      { label: "Home", path: "/" },
      { label: "All Application", path: "/allApplication" },
    ],
  };

  const role = data?.roles || "user";
  const t = navLinks[role] || [];
  async function handleLogout() {
    try {
      const res = await axiosInstance.post("/api/auth/user/logout");
      if (res.status != 200) throw new Error(" error in logout");
      navigate("/register");
    } catch (error) {
      console.error("Error:", error.res?.data || error.message);
    }
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-16 
                 flex items-center justify-between
                 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700
                 shadow-md px-6 z-30"
    >
      {/* Logo */}
      <div className="text-white text-2xl font-bold select-none">
        CollabForge
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8 text-gray-100 font-medium">
        <ul className="flex space-x-8">
          {t.map((item, index) => (
            <li key={index}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side buttons */}
      <div className="flex items-center space-x-4">
        {/* Profile Pic (Desktop) */}
        <div className="relative hidden md:block">
          <img
            src="https://i.pravatar.cc/50"
            alt="profile"
            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
            onClick={() => setProfileOpen(!profileOpen)}
          />

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md py-2 text-gray-700 font-medium z-50">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Settings
              </Link>
              <Link
                to="/mentorApplication"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Apply for Mentor
              </Link>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          className="absolute top-16 left-0 right-0 
                     bg-gradient-to-b from-blue-700 to-purple-700 
                     shadow-md md:hidden z-20"
        >
          <div className="flex flex-col space-y-3 px-6 py-4 text-white font-medium">
            <Link to="/" className="mobile-link">
              Home
            </Link>
            <Link to="/myProject" className="mobile-link">
              My Projects
            </Link>
            <Link to="#" className="mobile-link">
              Group Projects
            </Link>
            <Link to="/allProject" className="mobile-link">
              All Projects
            </Link>
            <Link to="#" className="mobile-link">
              Ask Mentor?
            </Link>

            {/* Profile section for mobile */}
            <hr className="border-gray-500" />

            <div className="flex items-center space-x-3 mt-2">
              <img
                src="https://i.pravatar.cc/50"
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <span className="text-white font-semibold">Your Name</span>
            </div>

            <Link to="/profile" className="mobile-link mt-1">
              Profile
            </Link>
            <Link to="/settings" className="mobile-link">
              Settings
            </Link>
            <Link
              to="/mentorApplication"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Apply for Mentor
            </Link>
            <button className="text-left mobile-link" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
