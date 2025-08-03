import { motion } from 'framer-motion';

export default function OrderCard({ order }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div>
        <div className="font-bold">Order #{order.id}</div>
        <div className="text-gray-500 text-sm">{order.date}</div>
      </div>
      <div className="text-pink-600 font-semibold">{order.status}</div>
      <div className="font-bold">{order.total}</div>
      <button className="bg-indigo-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-indigo-600 transition">View Details</button>
    </motion.div>
  );
} 