import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "../pages/Auth/Register/Register";
import Login from "../pages/Auth/Login/Login";
import CheckLogin from "../components/common/CheckLogin";
import AppLayout from "../components/AppLayout/AppLayout";


// 🔹 Lazy imports
const Home = lazy(() => import("../pages/Home/Home"));
const MyProject = lazy(() => import("../pages/project/myproject/MyProject"));
const Repos = lazy(() => import("../pages/Repos/Repos"));
const DataProject = lazy(() => import("../pages/project/data/DatagProject"));
const StudentRegister = lazy(() => import("../pages/role/student/StudentRegister"));
const AllProject = lazy(() => import("../pages/project/allProject/AllProject"));
const Setting = lazy(() => import("../pages/userMenu/setting/Setting"));
const UserData = lazy(() => import("../pages/userMenu/profile/UserData"));
const MentorRegister = lazy(() => import("../pages/role/mentor/MentorRegister"));
const MentorApplication = lazy(() => import("../pages/userMenu/mentorApplication/MentorApplication"));
const AllApplicaton = lazy(() => import("../pages/allMentorApplication/AllApplicaton"));
const MessagePage=lazy(()=>import ( "../pages/message/messagePage/MessagePage"));
const LinkRoutes = () => {
  return (
    <Router>
      {/* 🔴 REQUIRED */}
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route element={<CheckLogin />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/myProject" element={<MyProject />} />
              <Route path="/repos" element={<Repos />} />
              <Route path="/dataProject" element={<DataProject />} />
              <Route path="/allProject" element={<AllProject />} />
              <Route path="/studentRegister" element={<StudentRegister />} />
              <Route path="/settings" element={<Setting />} />
              <Route path="/profile" element={<UserData />} />
              <Route path="/mentorRegister" element={<MentorRegister />} />
              <Route path="/mentorApplication" element={<MentorApplication />} />
              <Route path="/allApplication" element={<AllApplicaton />} />
              <Route path="/messagePage" element={<MessagePage />} />
            </Route>
          </Route>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default LinkRoutes;
