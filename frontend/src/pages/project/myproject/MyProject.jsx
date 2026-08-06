import React from "react";
import MyProjectStructure from "./MyProjectStructure";
import ProjectCard from "../projectcard/ProjectCard";
import axiosInstance from "../../../api/authApi";
import { useNavigate } from "react-router-dom";

const MyProject = () => {
  const navigate = useNavigate();
  async function githubAccess() {
    try {
      const res = await axiosInstance.get("/api/auth/github/check");
      if (!res?.data?.connected) {
        const API_URL = import.meta.env.VITE_API_URL;
        window.location.href = `${API_URL}/api/auth/github/redirect`;
      } else {
        console.log("Github already connected");
      }
    } catch (error) {
      if (
        error.status === 403 ||
        error.response?.data?.requiresStudentRegistration
      ) {
        navigate("/register");
        return;
      }

      console.log("Github access error:", error);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <MyProjectStructure handleClick={githubAccess} />
      <ProjectCard path={`/api/project/user/allProject`} allowDelete={true} />
    </div>
  );
};

export default MyProject;
