import React, { useEffect, useState, useContext } from "react";
import logo from "../../public/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
import { AuthContext } from "../context/Authcontext"; // Update import path as needed

export default function Home() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/user/logout`, { withCredentials: true });
      logout();
      toast.success("Logged out");
      navigate("/");
    } catch (error) {
      console.error("Error while logging out:", error);
      const errorMessage =
        error?.response?.data?.errors || error?.message || "Error in logging out";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.log("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-100 to-indigo-900 overflow-x-hidden">
      <div className="text-black container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <img href="./" src={logo} alt="CourseFunda logo" className="h-20 w-20 rounded-full" />
            <h1 className="text-2xl text-indigo-950 font-bold">CourseFunda</h1>
          </div>
          <div className="space-x-5">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-6 py-3 border border-indigo-600 rounded hover:bg-indigo-600 hover:text-white"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="px-6 py-3 border border-indigo-600 rounded hover:bg-indigo-600 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="px-6 py-3 border text-white bg-indigo-600 border-indigo-600 rounded hover:bg-transparent hover:text-black"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </header>
        {/* Main Content */}
        <section className="text-center py-20">
          <h2 className="text-4xl font-bold text-center text-indigo-950 mt-10">Welcome to CourseFunda</h2>
          <br />
          <p className="mt-4 text-gray-900 text-lg ">Your one-stop solution for online courses</p>
          <div className="space-x-4 mt-6">
            <Link
              to={"./courses"}
              className="bg-indigo-900 hover:bg-neutral-50 text-white hover:text-black transition duration-300 px-6 py-3 border border-indigo-400 rounded font-semibold"
            >
              Explore Courses
            </Link>
            <Link
              to="/alumni"
              className="bg-neutral-50 hover:bg-indigo-900 hover:text-white transition duration-300 px-6 py-3 border border-indigo-400 rounded font-semibold"
            >
              Placed Alumni
            </Link>
          </div>
        </section>
        <section>
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id}>
                <div className="bg-white rounded-lg shadow-lg p-4 m-4">
                  <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <img className="h-32 w-full object-contain" src={course.image?.url} alt={course.title} />
                      <div className="p-6 text-center">
                        <h2 className="text-xl font-bold text-white">{course.title}</h2>
                        <Link
                          to={`/buy/${course._id}`}
                          className="text-black mt-4 py-2 px-4 bg-slate-400 rounded-3xl hover:bg-indigo-950 hover:text-white block text-center"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>
        <hr className="my-8 border border-indigo-950" />
        {/* Footer */}
        <footer className='my-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-6'>
            <div className='flex flex-col items-start md:items-start'>
              <div className='flex items-center space-x-2'>
                <img src={logo} alt="" className='h-10 w-10 rounded-full ' />
                <h1 className='text-xl text-indigo-950 font-bold'>CourseFunda</h1>
              </div>
              <div className='mt-3 ml-2 md:ml-8'>
                <p className='mb-2'>Follow us</p>
                <div className='flex space-x-4'>
                  <a href="" className="hover:text-blue-500 text-2xl duration-300"><FaFacebook size={24} />
                  </a>
                  <a href="" className="hover:text-pink-500 text-2xl duration-300"><FaInstagram size={24} />
                  </a>
                  <a href="" className="hover:text-blue-700 text-2xl duration-300"><FaTwitter size={24} />
                  </a>

                </div>
              </div>
            </div>
            <div>
              <div className='flex items-center flex-col'>
                <h3 className="font-semibold mb-4 text-lg text-black">Connect With Us</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className='hover:text-indigo-950 cursor-pointer duration-300'>YouTube: CourseFunda</li>
                  <li className='hover:text-indigo-950 cursor-pointer duration-300'>Telegram: CourseFunda</li>
                  <li className='hover:text-indigo-950 cursor-pointer duration-300'>GitHub: CourseFunda</li>
                </ul>
              </div>

            </div>

            <div>
              <div className='flex items-center flex-col'>
                <h3 className="font-semibold mb-2 text-black">Copyrights &copy; 2025</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className='hover:text-indigo-950 cursor-pointer duration-300'>Terms & Conditions</li>
                  <li className='hover:text-indigo-950 cursor-pointer duration-300'>Privacy Policy</li>
                  <li className='hover:text-indigo-950 cursor-pointer duration-300'>Refund & Cancellation</li>
                </ul>
              </div>

            </div>
          </div>
          <p className="text-center mt-6 text-indigo-950 text-sm">&copy; 2025 CourseFunda. All rights reserved.</p>

        </footer>
      </div>
    </div>
  );
}
