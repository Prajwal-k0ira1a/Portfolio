"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  // Section 1: Intro (Visible on load, fades out early)
  const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -30]);

  // Section 2: Statement (Fades in middle, fades out)
  const opacity2 = useTransform(scrollYProgress, [0.35, 0.4, 0.55, 0.65], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.35, 0.4, 0.65], [30, 0, -30]);

  // Section 3: Contact (Fades in late, fades out leaving sequence visible)
  const opacity3 = useTransform(scrollYProgress, [0.7, 0.75, 0.85, 0.95], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.7, 0.75, 0.95], [30, 0, -30]);
  const pointerEvents3 = useTransform(scrollYProgress, (v) => (v > 0.7 && v < 0.95) ? "auto" : "none");

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      
      {/* Section 1: Intro (Top Left Quadrant) */}
      <motion.div
        style={{ opacity: opacity1, y: y1 }}
        className="absolute top-12 left-8 md:top-20 md:left-20 flex flex-col items-start text-left pointer-events-none"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-xl">
          Prajwal Koirala.
          <span className="block text-xl md:text-2xl text-white/50 font-light mt-2">Frontend Developer</span>
        </h1>
      </motion.div>

      {/* Section 2: Statement (Center Right Quadrant) */}
      <motion.div
        style={{ opacity: opacity2, y: y2 }}
        className="absolute top-1/2 -translate-y-1/2 right-8 md:right-20 flex flex-col justify-center items-end text-right pointer-events-none"
      >
        <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-tight max-w-2xl drop-shadow-2xl">
          Intuitive Web <br />
          <span className="text-emerald-400">Solutions.</span>
        </h2>
      </motion.div>

      {/* Section 3: Contact (Bottom Left Quadrant) */}
      <motion.div
        style={{ opacity: opacity3, y: y3 }}
        className="absolute bottom-12 left-8 md:bottom-20 md:left-20 flex flex-col justify-end items-start text-left pointer-events-none"
      >
        <div className="flex flex-col items-start">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-xl mb-4">
            Let&apos;s <span className="text-cyan-400">Talk.</span>
          </h2>
          
          <motion.a 
            href="mailto:prajwalkoirala05@gmail.com"
            style={{ pointerEvents: pointerEvents3 }}
            className="text-lg md:text-xl text-white/70 hover:text-white transition-colors duration-300 drop-shadow-md border-b border-white/20 hover:border-white/50 pb-1"
          >
            prajwalkoirala05@gmail.com
          </motion.a>
        </div>
      </motion.div>
      
    </div>
  );
}
