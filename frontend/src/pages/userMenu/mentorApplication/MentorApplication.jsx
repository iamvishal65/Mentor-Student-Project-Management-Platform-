import { useEffect, useState } from "react";
import MentorApplicationStructure from "./MentorApplicationStructure";
import axiosInstance from "../../../api/authApi"

export default function MentorApplicationPage() {
  const [application, setApplication] = useState({
    status: "LOADING",
    nextEligibleAt: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch current application status
  const fetchApplicationStatus = async () => {
    try {
      setError("");

      const { data } = await axiosInstance.get(
        "/api/auth/mentor/applicationStatus",
        {
          withCredentials: true,
        }
      );

      setApplication(data);
    } catch (err) {
      if (err.response?.status === 409) {
        setApplication({
          status: "APPROVED",
        });
        return;
      }

      setError(
        err.response?.data?.message || "Something went wrong."
      );
    }
  };

  // Apply / Reapply
  const handleApply = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axiosInstance.post(
        "/api/auth/mentor/applyForMentor",
        {},
        {
          withCredentials: true,
        }
      );

      setApplication(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to submit application."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  return (
    <MentorApplicationStructure
      application={application}
      loading={loading}
      error={error}
      onApply={handleApply}
      onRefresh={fetchApplicationStatus}
    />
  );
}