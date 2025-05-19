"use client";

import React from "react";
import { motion } from "framer-motion";

const colors = ["#e11d48", "#f59e0b", "#10b981", "#3b82f6"];

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex gap-3">
        {colors.map((color, index) => (
          <motion.span
            key={index}
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}