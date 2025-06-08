"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex items-center justify-center gap-2 h-10">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-blue-500"
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 1.2,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.p 
          className="text-gray-600 font-medium text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Preparing your Page...
        </motion.p>

        <motion.div 
          className="h-1 w-32 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}