import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import AllApplicationPageStructure from "./AllApplicationStructure";
import axiosInstance from "../../api/authApi";

const AllApplicaton = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const[count,setCount]=useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/auth/admin/allApplication"); 
      setCount(res.data.count)
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Error fetching applications", err);
    } finally {
      setLoading(false);
    }
  };
  return <AllApplicationPageStructure applications={applications} loading={loading} count={count}/>;
};

export default AllApplicaton;
