import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import AllApplicationPageStructure from "./AllApplicationStructure";
import axiosInstance from "../../api/authApi";

const AllApplicaton = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(null);
  const [loadingAction, setLoadingAction] = useState({
    id: null,
    type: null,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/auth/admin/allApplication");
      setCount(res.data.count);
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Error fetching applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setLoadingAction({ id, type: "APPROVE" });

      await axiosInstance.post(`/api/auth/admin/approveApplication/${id}`);

      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Approve failed", err);
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };
  const handleReject = async (id) => {
    try {
      setLoadingAction({ id, type: "REJECT" });

      await axiosInstance.post(`/api/auth/admin/rejectApplication/${id}`);

      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Reject failed", err);
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };
  return (
    <AllApplicationPageStructure
      applications={applications}
      loading={loading}
      count={count}
      handleApprove={handleApprove}
      handleReject={handleReject}
      loadingAction={loadingAction}
    />
  );
};

export default AllApplicaton;
