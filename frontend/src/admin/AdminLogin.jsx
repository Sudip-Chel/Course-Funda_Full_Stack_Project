import React, { useState } from "react";
import logo from "../../public/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage(""); // Clear previous errors, if any

  try {
    const response = await axios.post(
      `${BACKEND_URL}/admin/login`,
      { email, password },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Ensure storage completes before navigation
    localStorage.setItem("admin", JSON.stringify(response.data));

    toast.success(response.data.message);

    // Navigate after setting localStorage
    navigate("/admin/dashboard", { replace: true });
  } catch (error) {
    if (error.response) {
      setErrorMessage(error.response.data.errors || "Login failed");
    } else {
      setErrorMessage("Network error or server not responding");
    }
  }
};

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-100 to-indigo-900'>
  <div className='container mx-auto flex items-center justify-center py-10'>
    {/* Header */}
    <header className='absolute top-0 left-0 w-full flex justify-between items-center p-5'>
      <div className='flex items-center space-x-2'>
        <img src={logo} alt="CourseHaven logo" className='h-16 w-16 rounded-full' />
        <Link to={"/"} className='text-2xl text-indigo-950 font-bold'>
          CourseHaven
        </Link>
      </div>
      <div className='space-x-4'>
        <Link
          to={"/admin/signup"}
          className='px-4 py-2 border border-indigo-600 rounded hover:bg-indigo-600 hover:text-white transition'
        >
          Signup
        </Link>
        <Link
          to={"/courses"}
          className='px-4 py-2 bg-indigo-600 text-white border border-indigo-600 rounded hover:bg-transparent hover:text-black transition'
        >
          Join now
        </Link>
      </div>
    </header>

    {/* Admin Login Form */}
    <div className='bg-white/80 p-8 rounded-xl shadow-xl w-full max-w-md mt-20'>
      <h2 className='text-2xl font-bold mb-4 text-center text-gray-800'>
        Welcome to <span className='text-indigo-950'>CourseHaven</span>
      </h2>
      <p className='text-center text-gray-700 mb-6'>
        Log in to access admin dashboard!
      </p>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='email' className='text-gray-900 mb-2 block'>
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            autoComplete='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full p-3 rounded-md bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600'
            placeholder='name@email.com'
            required
            aria-label='Email'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='password' className='text-gray-900 mb-2 block'>
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full p-3 rounded-md bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600'
            placeholder='********'
            required
            aria-label='Password'
          />
        </div>
        {errorMessage && (
          <div className='mb-4 text-red-600 text-sm whitespace-pre-line text-center'>
            {errorMessage}
          </div>
        )}
        <button
          type='submit'
          className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md transition'
        >
          Login
        </button>
      </form>
    </div>
  </div>
</div>

  );
}

export default AdminLogin;