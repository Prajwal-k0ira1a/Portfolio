"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.5], [100, -100]);

  const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.55, 0.85], [100, -100]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      {/* Global Vignette to ensure text always pops against the canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-transparent to-[#121212]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(18,18,18,0.6)_100%)] pointer-events-none" />

      {/* Section 1: Center Aligned */}
      <motion.div
        style={{ opacity: opacity1, y: y1 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
      >
      
        
        <h1 className="text-7xl md:text-[9rem] font-extrabold tracking-tighter text-white leading-none drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          Prajwal
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Koirala.</span>
        </h1>
        
        <p className="mt-8 text-2xl md:text-4xl font-light text-emerald-100/80 tracking-tight drop-shadow-xl max-w-xl">
          Frontend Developer
        </p>
      </motion.div>

      {/* Section 2: Left Aligned */}
      <motion.div
        style={{ opacity: opacity2, y: y2 }}
        className="absolute inset-0 flex items-center justify-start p-10 md:p-32"
      >
       
      </motion.div>

      {/* Section 3: Right Aligned */}
      <motion.div
        style={{ opacity: opacity3, y: y3 }}
        className="absolute inset-0 flex items-center justify-end p-10 md:p-32 text-right pointer-events-auto"
      >
        <div className="flex flex-col items-end">
          <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter text-white drop-shadow-[0_0_40px_rgba(0,0,0,0.9)] mb-12 leading-none">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">Connect.</span>
          </h2>
          
          <div className="flex flex-col items-end gap-5 text-2xl md:text-3xl font-medium tracking-tight">
            <a 
              href="mailto:prajwalkoirala05@gmail.com" 
              className="group flex items-center gap-4 hover:text-emerald-400 transition-colors duration-500 drop-shadow-lg"
            >
              prajwalkoirala05@gmail.com
              <ArrowRight className="w-8 h-8 transform group-hover:translate-x-3 transition-transform duration-500 opacity-50 group-hover:opacity-100" />
            </a>
            
            <span className="text-white/60 font-light drop-shadow-lg mt-2">+977 9827320629</span>
            
            <div className="w-full md:w-96 h-px bg-gradient-to-r from-transparent to-white/20 my-6" />
            
            <span className="text-white/40 text-xl font-light tracking-wide uppercase">
              Itahari International College
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
