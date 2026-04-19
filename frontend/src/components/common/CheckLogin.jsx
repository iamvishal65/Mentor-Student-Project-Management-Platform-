import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosInstance from "../../api/authApi";
import { useRecoilState } from "recoil";
import { userData } from "../../recoil/UserData";

const CheckLogin = () => {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useRecoilState(userData);
  const location = useLocation(); 

  useEffect(() => {
    async function loginCheck() {
      try {
        const res = await axiosInstance.get("/api/auth/logincheck");
        if (res.data.loggedIn) {
          setLoggedIn(true);
          setData(res.data.user);
          const user=res.data.user.roles;
          const role=user;
        } else {
          setLoggedIn(false);
        }
      } catch (err) {
        console.error("Login check failed:", err);
        setLoggedIn(false);
      } finally {
        setChecking(false);
      }
    }

    loginCheck();
  }, []);

  // 🔹 While verifying login state
  if (checking) return <p>⏳ Checking login...</p>;

  // 🔹 Only redirect to /login if not logged in and not already there
  if (!loggedIn && location.pathname !== "/login" && location.pathname !== "/register") {
    return <Navigate to="/register" replace />;
  }

  
  return <Outlet />;
};

export default CheckLogin;
