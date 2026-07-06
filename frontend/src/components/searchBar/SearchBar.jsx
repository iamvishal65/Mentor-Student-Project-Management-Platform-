import React, { useState } from "react";
import SearchBarStructure from "./SearchBarStructure";
import axiosInstance from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userProfileData } from "../../recoil/ProfileData";

const SearchBar = ({ className = "", scope }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [, setProfileData] = useRecoilState(userProfileData);
  const navigate = useNavigate();
  async function onSearch(value) {
    setLoading(true);
    const params = new URLSearchParams({
      q: value,
      scope,
    });

    try {
      const res = await axiosInstance.get(`/api/user/profile/searchProfile?${params.toString()}`,);
      if (!res.data.success) {
        setMessage("something wrong");
        return;
      }

      if (res.data.data.length === 0) {
        setMessage("no user found");
        return;
      }

      setProfileData(res.data.data);
      
      
      navigate("/profile", {
        state: {
          profile: res.data.data,
        },
      });
    } catch (error) {
      setMessage("Search failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <SearchBarStructure onSearch={onSearch} className={className} />
    </div>
  );
};

export default SearchBar;
