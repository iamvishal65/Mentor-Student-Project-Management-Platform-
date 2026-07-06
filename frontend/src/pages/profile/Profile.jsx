import React from "react";
import ProfilePageStructure from "./ProfileStructure";
import { useRecoilState } from "recoil";
import { userProfileData } from "../../recoil/ProfileData";
import { userData } from "../../recoil/UserData";
import { useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [data, setData] = useRecoilState(userData);
  const[profileData,setProfileData]=useRecoilState(userProfileData);
  const location = useLocation();
  const profile = location.state?.profile;
  async function messageUser(id) {
    try {
      console.log(profileData);
      
      if (profileData.roles.includes("student") || profileData.roles.includes("mentor")) {
        navigate("/messagePage");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <ProfilePageStructure
        profile={profile}
        messageUser={messageUser}
        currentUser={data}
      />
    </div>
  );
};

export default Profile;
