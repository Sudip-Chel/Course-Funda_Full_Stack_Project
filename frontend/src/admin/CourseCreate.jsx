import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../public/logo.png";
import { BACKEND_URL } from "../utils/utils";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import { useEffect } from "react";






function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const { admin, token, logout } = useAdminAuth();

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };


  useEffect(() => {
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
    }
  }, [token, navigate]);


  useEffect(() => {
    if (admin === null || token === null) {
      // If admin/token is missing from context, redirect
      toast.error("Please login to admin");
      navigate("/admin/login");
    }
  }, [admin, token, navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, { withCredentials: true });
      toast.success(response.data.message);
      logout();  // clear context & localStorage & redirect inside logout
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);






    try {
      const response = await axios.post(
        `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success(response.data.message || "Course created successfully");
      navigate("/admin/our-courses");
      setTitle("");
      setPrice("");
      setImage("");
      setDescription("");
      setImagePreview("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.errors);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <div className="bg-red-50 w-64 h-screen  p-5">
          <div className="flex items-center flex-col mb-10">
            <img src={logo} alt="Profile" className="rounded-full h-20 w-20" />
            <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link to="/admin/our-courses">
              <button className="w-full bg-fuchsia-900 hover:bg-green-600 text-white py-2 rounded">
                Our Courses
              </button>
            </Link>
            <Link to="/admin/create-course">
              <button className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 rounded">
                Create Course
              </button>
            </Link>
            <Link to="/">
              <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
                Home
              </button>
            </Link>
            <Link to="/admin/login">
              <button
                onClick={handleLogout}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
              >
                Logout
              </button>
            </Link>
          </nav>
        </div>
        {/* Main Content */}
        <div className="w-4/5 mx-auto p-6 border  rounded-lg shadow-lg ">
          <h3 className="text-2xl font-semibold mb-8">Create Course</h3>
          <form onSubmit={handleCreateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="Image"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Create Course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CourseCreate;
