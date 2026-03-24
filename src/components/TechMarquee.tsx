"use client";

import { motion } from "framer-motion";
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiJavascript, 
  SiMongodb, 
  SiNodedotjs, 
  SiExpress, 
  SiPython, 
  SiHtml5, 
  SiCss 
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

const TECHNOLOGIES = [
  { name: "React", icon: SiReact, color: "group-hover:text-[#61DAFB]" },
  { name: "Next.js", icon: SiNextdotjs, color: "group-hover:text-white" },
  { name: "TypeScript", icon: SiTypescript, color: "group-hover:text-[#3178C6]" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "group-hover:text-[#06B6D4]" },
  { name: "JavaScript", icon: SiJavascript, color: "group-hover:text-[#F7DF1E]" },
  { name: "MongoDB", icon: SiMongodb, color: "group-hover:text-[#47A248]" },
  { name: "Node.js", icon: SiNodedotjs, color: "group-hover:text-[#5FA04E]" },
  { name: "Express.js", icon: SiExpress, color: "group-hover:text-white" },
  { name: "Python", icon: SiPython, color: "group-hover:text-[#3776AB]" },
  { name: "Java", icon: FaJava, color: "group-hover:text-[#007396]" },
  { name: "HTML5", icon: SiHtml5, color: "group-hover:text-[#E34F26]" },
  { name: "CSS3", icon: SiCss, color: "group-hover:text-[#1572B6]" },
];

// Combine exactly 3 sets for a perfect 33.33% infinite seamless loop
const EXTENDED_TECHNOLOGIES = [...TECHNOLOGIES, ...TECHNOLOGIES, ...TECHNOLOGIES];

export default function TechMarquee() {
  return (
    <section className="bg-[#121212] border-y border-white/[0.04] overflow-hidden py-16 md:py-24 relative z-10 w-full flex items-center">
      {/* Left/Right fading gradients to blend the marquee smoothly */}
      <div className="absolute top-0 bottom-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#121212] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-32 md:w-64 bg-gradient-to-l from-[#121212] to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex flex-nowrap whitespace-nowrap gap-12 md:gap-24 w-max"
        animate={{
          x: ["0%", "-33.333333%"]
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 40
        }}
      >
        {EXTENDED_TECHNOLOGIES.map((tech, idx) => (
          <div 
            key={idx}
            className="group flex items-center gap-12 md:gap-24 uppercase"
          >
            <div className="flex items-center gap-6 md:gap-8 cursor-default select-none transition-transform duration-500 group-hover:scale-110">
              <tech.icon className={`w-12 h-12 md:w-20 md:h-20 text-white/10 transition-colors duration-500 ${tech.color}`} />
              <span 
                className={`text-5xl md:text-[6rem] font-bold tracking-tighter text-transparent transition-colors duration-500 ${tech.color}`}
                style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.2)" }}
              >
                {tech.name}
              </span>
            </div>
            
            <span className="text-emerald-500/20 text-3xl md:text-5xl font-light select-none">✦</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
