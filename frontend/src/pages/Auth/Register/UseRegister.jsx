import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/authApi";

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      if (!data) throw new Error("Enter data");

      setLoading(true);

      const res = await axiosInstance.post("/api/auth/user/register", data);

      if (res.status !== 201 || !res.data?.success) {
        throw new Error(res.data?.message || "Registration failed");
      }

      console.log("registered");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  function goLogin() {
    navigate("/login");
  }

  return { handleRegister, loading, goLogin };
}