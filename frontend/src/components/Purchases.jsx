import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../context/Authcontext";

function Purchases() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [purchases, setPurchases] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view your purchases");
      navigate("/login");
      return;
    }

    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const { purchases: userPurchases, courseData } = response.data;

        const mergedPurchases = userPurchases.map((purchase) => {
          const course =
            courseData.find(
              (c) => c._id.toString() === purchase.courseId.toString()
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

    fetchPurchases();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/user/logout`, { withCredentials: true });
      logout();
      toast.success("Logged out");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.errors || "Error in logging out"
      );
    }
  };

  // Sidebar toggle for small screens
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 border-r border-gray-200 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <nav>
          <ul className="mt-12 md:mt-0 text-base">
            <li className="mb-4">
              <Link to="/" className="flex items-center font-semibold hover:text-indigo-700">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center font-semibold hover:text-indigo-700">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/purchases" className="flex items-center text-blue-500 font-bold">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            
            <li>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 mt-4 hover:underline"
                >
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center mt-4 text-indigo-600 hover:underline">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-indigo-600 text-white p-2 rounded-lg shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Main Content */}
      <div className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        <h2 className="text-xl font-semibold mb-8 text-indigo-950">My Purchases</h2>
        {errorMessage && (
          <div className="text-red-500 text-center mb-6">{errorMessage}</div>
        )}

        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
              >
                <img
                  className="rounded-lg w-full h-48 object-cover mb-3"
                  src={
                    purchase.courseId?.image?.url ||
                    "https://via.placeholder.com/200"
                  }
                  alt={purchase.courseId?.title || "Course image"}
                  loading="lazy"
                />
                <h3 className="text-lg font-bold mt-2">
                  {purchase.courseId?.title || "Unknown Course"}
                </h3>
                <p className="text-gray-700 text-sm my-2 text-center">
                  {purchase.courseId?.description
                    ? purchase.courseId.description.length > 100
                      ? `${purchase.courseId.description.slice(0, 100)}...`
                      : purchase.courseId.description
                    : "No description"}
                </p>
                <span className="text-green-700 font-semibold text-sm mb-2">
                  ₹{purchase.courseId?.price || "N/A"} only
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-18 text-center">You have no purchases yet.</p>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="mt-10 px-6 py-3 bg-indigo-600 text-white rounded transition hover:bg-indigo-700"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Purchases;
