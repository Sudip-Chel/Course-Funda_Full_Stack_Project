import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { useAuth } from "../context/Authcontext";

// Razorpay script loader
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function Buy() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      setAuthChecked(true);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!authChecked) return;

    const fetchCourseDetails = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(data.course);
      } catch (err) {
        setError("Failed to load course details");
      }
    };

    fetchCourseDetails();
  }, [courseId, token, authChecked]);

  const handlePurchase = async () => {
    setLoading(true);
    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      toast.error("Razorpay SDK failed to load. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/course/buy/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Course Purchase",
        description: data.course?.title || "Course payment",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await axios.post(
              `${BACKEND_URL}/course/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              }
            );
            toast.success("Payment successful!");
            navigate("/purchases");
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.firstName || "User",
          email: user?.email || "",
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      if (error.response?.data?.alreadyPurchased) {
        toast("You already purchased this course", { icon: "ℹ️" });
        navigate("/purchases");
      } else {
        toast.error(error.response?.data?.error || "Error purchasing course");
      }
      setLoading(false);
    }
  };

  if (!authChecked) {
    return null;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
          <p className="text-lg font-semibold">{error}</p>
          <Link
            to="/purchases"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
          >
            Purchases
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-indigo-900 p-6">
      <h1 className="text-2xl font-bold mb-6">Buy Course</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center mt-4 space-x-2">
              <span className="text-gray-600 text-sm">Total Price:</span>
              <p className="text-red-500 font-bold">₹{course.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm">Course Name:</span>
              <p className="text-red-500 font-bold">{course.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center mt-6 sm:mt-0">
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
            >
              {loading ? "Processing..." : "Pay with Razorpay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Buy;
