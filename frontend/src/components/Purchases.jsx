import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaDiscourse,
  FaDownload
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";



function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Ensure user is logged in or redirect immediately on mount
  useEffect(() => {
    if (!token) {
      toast.error("Please login to view your purchases");
      navigate("/login");
      return;
    }
    setIsLoggedIn(true);
  }, [token, navigate]);

  // Fetch purchase data only if logged in
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/purchases`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const { purchases: userPurchases, courseData } = response.data;

        // Map purchases to include course details
        const mergedPurchases = userPurchases.map((purchase) => {
          const course =
            courseData.find(
              (course) =>
                course._id.toString() === purchase.courseId.toString()
            ) || null;
          return { ...purchase, courseId: course };
        });

        setPurchases(mergedPurchases);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to fetch purchase data"
        );
        toast.error(
          error.response?.data?.message || "Failed to fetch purchase data"
        );
      }
    };

    if (token) {
      fetchPurchases();
    }
  }, [token]);

  // Logout clears login info & redirects home
  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/user/logout`, { withCredentials: true });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      toast.success("Logged out");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };


  // Sidebar toggle for small screens
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/purchases" className="flex items-center text-blue-500">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <HiX className="text-2xl" />
        ) : (
          <HiMenu className="text-2xl" />
        )}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <h2 className="text-xl font-semibold mt-6 md:mt-0 mb-6">My Purchases</h2>

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {/* Render purchases */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 mb-6"
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Course Image */}
                  <img
                    className="rounded-lg w-full h-48 object-cover"
                    src={
                      purchase.courseId?.image?.url ||
                      "https://via.placeholder.com/200"
                    }
                    alt={purchase.courseId?.title || "Course image"}
                    loading="lazy"
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold">
                      {purchase.courseId?.title || "Unknown Course"}
                    </h3>
                    <p className="text-gray-500">
                      {purchase.courseId?.description?.length > 100
                        ? `${purchase.courseId.description.slice(0, 100)}...`
                        : purchase.courseId?.description || "No description"}
                    </p>
                    <span className="text-green-700 font-semibold text-sm">
                      ₹{purchase.courseId?.price || "N/A"} only
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no purchases yet.</p>
        )}
      </div>
    </div>
  );
}

export default Purchases;
