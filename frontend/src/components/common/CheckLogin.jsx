import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosInstance from "../../api/authApi";
import { useRecoilState } from "recoil";
import { userData } from "../../recoil/UserData";

const CheckLogin = () => {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [, setData] = useRecoilState(userData);
  const location = useLocation();

  useEffect(() => {
    async function loginCheck() {
      try {
        console.log(import.meta.env.VITE_API_URL);
        const res = await axiosInstance.get("/api/auth/logincheck");

        if (res.data.loggedIn) {
          const user = res.data.user;
          setData({
            ...user,
            roles: user.roles || [],
          });
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
          setData(null);
        }
      } catch (err) {
        console.error("Login check failed:", err);
        setLoggedIn(false);
        setData(null);
      } finally {
        setChecking(false);
      }
    }

    loginCheck();
  }, [setData]);

  if (checking) {
    return <p>⏳ Checking login...</p>;
  }

  if (
    !loggedIn &&
    location.pathname !== "/login" &&
    location.pathname !== "/register"
  ) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
};

export default CheckLogin;