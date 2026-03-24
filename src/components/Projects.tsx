import { ArrowRight, ExternalLink } from "lucide-react";

const PROJECTS = [
  {
    title: "Library Management System",
    description: "A MERN-based web app built with MongoDB, Express.js, React, and Node.js to manage books, members, and transactions efficiently.",
    tags: ["MERN", "React", "MongoDB", "Node.js"],
    color: "from-emerald-500/10 to-teal-500/10"
  },
  {
    title: "Mero Paalo",
    description: "Queue management web application designed to allow users to book, track, and manage their turn digitally, reducing waiting time.",
    tags: ["React", "JavaScript", "Web App"],
    color: "from-cyan-500/10 to-blue-500/10"
  },
  {
    title: "Cinema Hub",
    description: "A cinema ticketing application dedicated to solving the problem of long lines by creating showtimes and booking tickets digitally.",
    tags: ["React", "CSS", "Frontend"],
    color: "from-indigo-500/10 to-purple-500/10"
  }
];

export default function Projects() {
  return (
    <section className="relative z-10 bg-[#121212] py-32 md:py-48 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-20 md:mb-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="text-sm font-semibold tracking-[0.2em] text-white/50 uppercase">
              Portfolio
            </span>
          </div>
          <h2 className="text-6xl md:text-[7rem] font-bold tracking-tighter text-white mb-8 leading-none">
            Selected <span className="text-white/40 italic font-serif tracking-normal">Work</span>
          </h2>
          <p className="text-xl md:text-3xl text-white/40 max-w-3xl font-light leading-relaxed">
            A showcase of recent digital experiences, built with modern web technologies 
            and a focus on performance.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {PROJECTS.map((project, i) => (
            <div 
              key={i}
              className="group relative flex flex-col justify-between p-10 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-700 hover:bg-white/[0.04] hover:border-white/[0.15] hover:-translate-y-3"
            >
              {/* Subtle hover gradient glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10`} />
              
              <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 text-white/40">
                <ExternalLink className="w-8 h-8" />
              </div>

              <div className="mb-16">
                <div className="flex flex-wrap gap-2 mb-10">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 text-xs font-bold tracking-widest text-white/70 bg-white/5 border border-white/10 rounded-full uppercase transition-colors group-hover:bg-white/10 group-hover:text-white">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-white/50 transition-all duration-500">
                  {project.title}
                </h3>
                <p className="text-white/50 text-xl font-light leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center text-white/30 group-hover:text-emerald-400 transition-colors duration-500 font-semibold tracking-widest uppercase text-sm cursor-pointer w-max pointer-events-auto">
                <span>View Details</span>
                <ArrowRight className="w-5 h-5 ml-3 transform group-hover:translate-x-3 transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
