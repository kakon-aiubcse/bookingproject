import { motion } from "framer-motion";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen bg-bgrnd-0">
      <motion.div
        className="w-10 h-10 border-4 border-btton-0 border-t-transparent border-solid rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
      />
    </div>
  );
}
