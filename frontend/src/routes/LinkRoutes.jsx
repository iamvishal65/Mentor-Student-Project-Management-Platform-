import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../pages/Auth/Register/Register";
import Login from "../pages/Auth/Login/Login";
import CheckLogin from "../components/common/CheckLogin";
import AppLayout from "../components/AppLayout/AppLayout";
import Home from "../pages/Home/Home";
import MyProject from "../pages/project/myproject/MyProject";
import Repos from "../pages/Repos/Repos";
import DataProject from "../pages/project/data/DatagProject";
import StudentRegister from "../pages/role/student/StudentRegister";
import AllProject from "../pages/project/allProject/AllProject";
import Setting from "../pages/userMenu/setting/Setting";
import UserData from "../pages/userMenu/profile/UserData";
import ChatPage from "../pages/Chat/ChatPage";

const LinkRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<CheckLogin/>}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/myProject" element={<MyProject />} />
            <Route path="/repos" element={<Repos/>} />
            <Route path="/dataProject" element={<DataProject/>} />
            <Route path="/allProject" element={<AllProject />} />
            <Route path="/studentRegister" element={<StudentRegister/>} />
            <Route path="/settings" element={<Setting/>} />
            <Route path="/profile" element={<UserData/>} />
            <Route path="/chatPage" element={<ChatPage/>} /> 
          </Route>
        </Route>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  );
};

export default LinkRoutes;
