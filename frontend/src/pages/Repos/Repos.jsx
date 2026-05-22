import { useEffect, useState } from "react";
import axiosInstance from "../../api/authApi";
import ReposStructure from "./ReposStructure";
import { useNavigate } from "react-router-dom";

const Repos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/github/repos");
        
        setRepos(res.data);
      } catch (err) {
        console.error("Failed to load repos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);
  function handleclick(){
   navigate("/dataProject");
  }

  if (loading) return <p>Loading repos...</p>;

  return (
    <div>
      <ReposStructure repos={repos} handleclick={handleclick}/>
    </div>
  );
};

export default Repos;
