import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Courses from "./components/Courses.jsx";
import Buy from "./components/Buy.jsx";
import Purchases from "./components/Purchases.jsx";
import PlacedAlumni from "./components/PlacedAlumni.jsx";

import AdminSignup from "./admin/AdminSignup.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import CourseCreate from "./admin/CourseCreate.jsx";
import UpdateCourse from "./admin/UpdateCourse.jsx";
import OurCourses from "./admin/OurCourses.jsx";

import { Toaster } from "react-hot-toast";

// ProtectedRoute component
const ProtectedRoute = ({ isAllowed, redirectPath = "/login", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  const isUserLoggedIn = !!user;
  const isAdminLoggedIn = !!admin;

  return (
    <div>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />

        {/* Protected User Routes */}
        <Route
          element={<ProtectedRoute isAllowed={isUserLoggedIn} />}
        >
          <Route path="/buy/:courseId" element={<Buy />} />
          <Route path="/purchases" element={<Purchases />} />
        </Route>

        {/* Other public routes */}
        <Route path="/alumni" element={<PlacedAlumni />} />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          element={<ProtectedRoute isAllowed={isAdminLoggedIn} redirectPath="/admin/login" />}
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/create-course" element={<CourseCreate />} />
          <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
          <Route path="/admin/our-courses" element={<OurCourses />} />
        </Route>

        {/* Fallback route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
