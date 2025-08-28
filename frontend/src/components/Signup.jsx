import React, { useState } from "react";
import logo from "../../public/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

export default function Signup() {
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
        `${BACKEND_URL}/user/signup`,
        { firstName, lastName, email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        const err = error.response.data;
        if (Array.isArray(err.error)) {
          setErrorMessage(err.error.join("\n"));
        } else {
          setErrorMessage(err.error || "Signup failed!");
        }
        toast.error("Signup failed!");
      } else {
        setErrorMessage("Network or server error");
        toast.error("Signup failed!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-indigo-900 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        {/* Header */}
        <header className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt="CourseFunda logo"
              className="h-12 w-12 sm:h-20 sm:w-20 rounded-full"
            />
            <h1 className="text-xl sm:text-2xl text-indigo-950 font-bold">
              CourseFunda
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="px-4 py-2 sm:px-6 sm:py-3 border border-indigo-600 rounded hover:bg-indigo-600 hover:text-white text-base sm:text-lg"
            >
              Login
            </Link>
            <Link
              to="/"
              className="px-4 py-2 sm:px-6 sm:py-3 border bg-indigo-600 text-white border-indigo-600 rounded hover:bg-transparent hover:text-black text-base sm:text-lg"
            >
              Join
            </Link>
          </div>
        </header>
      </div>

      {/* Signup Form Centered */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white/80 p-8 rounded-xl shadow-xl w-full max-w-md mt-12 sm:mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Welcome to <span className="text-indigo-950">CourseFunda</span>
          </h2>
          <p className="text-center text-gray-700 mb-6">
            Just Signup To Join Us!
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="firstname"
                className="text-gray-900 mb-2 block"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 rounded-md bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Type your firstname"
                required
                aria-label="First Name"
              />
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="text-gray-900 mb-2 block"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 rounded-md bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Type your lastname"
                required
                aria-label="Last Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-gray-900 mb-2 block">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="name@email.com"
                required
                aria-label="Email"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-gray-900 mb-2 block">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
