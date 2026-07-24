import React from "react";
import axiosInstance from "../../../api/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (data) => {
    try {
      if (!data) throw new Error("Enter data");
      setLoading(true);
      const res = await axiosInstance.post("/api/auth/user/login", data);
      if (res.status != 200 || !res.data?.success) {
        throw new Error(res.data.message);
      }
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      console.error("Message:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return { handleSubmit, loading };
}
