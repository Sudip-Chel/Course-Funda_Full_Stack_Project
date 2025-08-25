import React from 'react';
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const alumni = [
  {
    name: "Sonal Sharma",
    company: "Google",
    image: "https://randomuser.me/api/portraits/women/79.jpg",
    rating: 5,
    testimonial: "CourseFunda helped me learn full-stack development. I cracked my dream job at Google!",
  },
  {
    name: "Rahul Patel",
    company: "Amazon",
    image: "https://randomuser.me/api/portraits/men/16.jpg",
    rating: 4,
    testimonial: "Great mentorship, hands-on projects, and responsive support. Highly recommended!",
  },
  {
    name: "Ananya Rao",
    company: "Microsoft",
    image: "https://randomuser.me/api/portraits/women/35.jpg",
    rating: 5,
    testimonial: "Projects and interviews prep were spot on. Thanks to the team for my placement!",
  },
  {
    name: "Sonal Sharma",
    company: "Google",
    image: "https://randomuser.me/api/portraits/women/80.jpg",
    rating: 5,
    testimonial: "CourseFunda helped me learn full-stack development. I cracked my dream job at Google!",
  },
  {
    name: "Sonal Sharma",
    company: "Google",
    image: "https://randomuser.me/api/portraits/women/67.jpg",
    rating: 5,
    testimonial: "CourseFunda helped me learn full-stack development. I cracked my dream job at Google!",
  },
 
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
};

export default function PlacedAlumni() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-indigo-900 flex flex-col items-center py-10">
      <h2 className="text-4xl text-indigo-900 font-bold mb-8">Placed Alumni</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6">
        {alumni.map((a, idx) => (
          <motion.div
            key={idx}
            initial="hidden"
            animate="show"
            variants={cardVariants}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform"
          >
            <img src={a.image} alt={a.name} className="w-20 h-20 rounded-full mb-4 object-cover shadow-md" />
            <h3 className="text-xl font-bold text-indigo-900">{a.name}</h3>
            <p className="text-indigo-500 font-semibold">{a.company}</p>
            <div className="flex my-2">
              {Array.from({ length: a.rating }).map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 + idx * 0.2 }}
              className="text-gray-700 text-center italic mt-2"
            >
              "{a.testimonial}"
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
