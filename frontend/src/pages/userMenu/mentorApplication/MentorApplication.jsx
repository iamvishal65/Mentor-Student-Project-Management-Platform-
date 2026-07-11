import React from "react";
import axiosInstance from "../../../api/authApi";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
//update
import MentorApplicationStructure from "./mentorApplicationStructure";

const MentorApplication = () => {
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [nextEligibleAt, setNextEligibleAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/auth/mentor/applicationStatus",
        );
        const status = res.data.status;
        setApplicationStatus(status);
        if (status === "APPROVED") {
          navigate("/mentorRegister");
        }
        if (status != "NOT APPLIED") {
          setNextEligibleAt(res.data.nextEligibleAt);
        }
      } catch (error) {
        console.error("Error in fetching application status", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const applyForMentorRole = async () => {
    try {
      const res = await axiosInstance.post("/api/auth/mentor/applyForMentor");
      setApplicationStatus(res.data.status);
      setNextEligibleAt(res.data.nextEligibleAt);
    } catch (error) {
      console.error("Error in applying for mentor", error);
    }
  };
  return (
    <MentorApplicationStructure
      applyForMentorRole={applyForMentorRole}
      loading={loading}
      applicationStatus={applicationStatus}
      nextEligibleAt={nextEligibleAt}
    />
  );
};
export default MentorApplication;
