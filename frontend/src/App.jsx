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

import { AuthProvider, useAuth } from "./context/Authcontext.jsx";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext.jsx";
import { Toaster } from "react-hot-toast";

// Protected route for user
const ProtectedRoute = ({ redirectPath = "/login", children }) => {
  const { user, token } = useAuth();
  if (!user || !token) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

// Protected route for admin
const AdminProtectedRoute = ({ redirectPath = "/admin/login", children }) => {
  const { admin, token } = useAdminAuth();
  if (!admin || !token) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/alumni" element={<PlacedAlumni />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/buy/:courseId" element={<Buy />} />
            <Route path="/purchases" element={<Purchases />} />
          </Route>

          {/* Admin Auth Public */}
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/create-course" element={<CourseCreate />} />
            <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
            <Route path="/admin/our-courses" element={<OurCourses />} />
          </Route>

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
