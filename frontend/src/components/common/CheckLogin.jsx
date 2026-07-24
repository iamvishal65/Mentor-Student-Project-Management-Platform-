import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import axiosInstance from "../../api/authApi";
import { userData } from "../../recoil/UserData";

export default function CheckLogin() {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const setUser = useSetRecoilState(userData);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const checkLogin = async () => {
      try {
        const { data } = await axiosInstance.get("/api/auth/logincheck");

        if (!mounted) return;

        if (data.loggedIn) {
          setLoggedIn(true);

          setUser({
            ...data.user,
            roles: data.user.roles || [],
          });
        } else {
          setLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        if (!mounted) return;

        console.error(error);
        setLoggedIn(false);
        setUser(null);
      } finally {
        if (mounted) setChecking(false);
      }
    };

    checkLogin();

    return () => {
      mounted = false;
    };
  }, [setUser]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking Login...
      </div>
    );
  }

  if (
    !loggedIn &&
    !["/login", "/register"].includes(location.pathname)
  ) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
}