import React, { useState } from "react";
import logo from "../../public/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function AdminSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/signup`,
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      navigate("/admin/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "AdminSignup failed!!!");
        toast.error("AdminSignup failed!!!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-indigo-900 flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-4 py-4 fixed top-0 left-0 bg-gradient-to-br from-red-100 to-indigo-900 z-30">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="CourseFunda logo" className="h-12 w-12 sm:h-16 sm:w-16 rounded-full" />
          <h1 className="text-xl sm:text-2xl text-indigo-950 font-bold">CourseFunda</h1>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/admin/login"
            className="px-4 py-2 border border-indigo-600 rounded hover:bg-indigo-600 hover:text-white text-base transition"
          >
            Login
          </Link>
          <Link
            to="/"
            className="px-4 py-2 border bg-indigo-600 text-white border-indigo-600 rounded hover:bg-transparent hover:text-black text-base transition"
          >
            Join
          </Link>
        </div>
      </header>

      {/* Form Section */}
      <main className="flex-grow flex items-center justify-center px-4 pt-24">
        <div className="bg-white/80 p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Welcome to <span className="text-indigo-950">CourseFunda</span>
          </h2>
          <p className="text-center text-gray-700 mb-6">
            Just Signup and Do Customisation!
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstname" className="text-gray-900 mb-2 block">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                autoComplete="given-name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full p-3 rounded-md bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Type your firstname"
                required
                aria-label="First Name"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="text-gray-900 mb-2 block">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                autoComplete="family-name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full p-3 rounded-md bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Type your lastname"
                required
                aria-label="Last Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-gray-900 mb-2 block">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="name@email.com"
                required
                aria-label="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-gray-900 mb-2 block">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="********"
                required
                aria-label="Password"
              />
            </div>
            {errorMessage && (
              <div className="text-red-600 text-sm whitespace-pre-line text-center">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md transition"
            >
              Signup
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AdminSignup;
