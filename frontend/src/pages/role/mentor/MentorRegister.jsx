import React from "react";
import MentorRegisterForm from "./MentorRegisterForm";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/authApi";
import { useState } from "react";

const MentorRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    try {
      setLoading(true);
      await axiosInstance.post("/api/auth/mentor/register", data);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return <MentorRegisterForm onSubmit={handleSubmit} loading={loading} />;
};

export default MentorRegister;
