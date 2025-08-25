import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle, FaDiscourse } from "react-icons/fa";
import { RiHome2Fill } from "react-icons/ri";
import { FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../../public/logo.png";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        toast.error("Error fetching courses");
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  // Logout function
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

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-red-50">
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
        aria-label="Open sidebar"
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-br from-red-100 to-indigo-900 w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img src={logo} alt="Profile" className="rounded-full h-12 w-12" />
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center text-blue-500">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/purchases" className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
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
      </aside>

      {/* Main content */}
      <main className="ml-0 md:ml-64 w-full bg-white p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold">Courses</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type here to search..."
                className="border border-gray-300 rounded-l-full px-4 py-2 h-10 focus:outline-none"
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center">
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>
            <FaUserCircle className="text-4xl text-blue-600" />
          </div>
        </header>

        {/* Courses Section */}
        <div className="overflow-y-auto h-[80vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500">
              No course posted yet by admin
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <img
                    src={course.image?.url || "/placeholder.png"}
                    alt={course.title}
                    className="rounded mb-4"
                  />
                  <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {course.description?.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl">
                      ₹{course.price || 0}{" "}
                      <span className="text-gray-500 line-through">5999</span>
                    </span>
                    <span className="text-green-600">20% off</span>
                  </div>
                  <Link
                    to={`/buy/${course._id}`}
                    className="bg-fuchsia-900 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-900 duration-300 block text-center"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Courses;
