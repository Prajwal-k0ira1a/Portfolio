import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PROJECTS = [
  {
    title: "Library Manager",
    description: "MERN stack platform for books and transactions.",
    tags: ["MERN", "React", "MongoDB"],
    color: "from-emerald-500/10 to-teal-500/10",
    href: "https://library-frontend-taupe.vercel.app/",
    cta: "Open Library",
  },
  {
    title: "Mero Paalo",
    description: "Digital queue and turn management application.",
    tags: ["React", "Queue System"],
    color: "from-cyan-500/10 to-blue-500/10",
    href: "https://meropaalo-queue-frontend.vercel.app/",
    cta: "Open Mero Paalo",
  },
  {
    title: "Cinema Hub",
    description: "Digital cinema ticketing and showtime platform.",
    tags: ["React", "CSS"],
    color: "from-indigo-500/10 to-purple-500/10",
    href: "https://cinemahub-frontend.vercel.app/",
    cta: "Open Cinema Hub",
  },
];

export default function Projects() {
  return (
    <section className="relative z-10 bg-[#121212] py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16 md:mb-24 flex flex-col items-center justify-center text-center">
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            Worked with  <span className="text-white/40 font-light">Following Projects</span>
          </h2>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light">
            Recent projects built with a focus on performance.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {PROJECTS.map((project, i) => (
            <Link
              key={i}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col justify-between p-8 md:p-10 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] backdrop-blur-md shadow-xl overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.2] hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10`} />
              
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 text-white/40">
                <ExternalLink className="w-6 h-6" />
              </div>

              <div className="mb-10">
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-white/5 hover:bg-white/10 text-white/70 border-none font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-white/50 font-light text-base leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="pointer-events-auto">
                <Button variant="ghost" className="pointer-events-none text-white/50 group-hover:text-white p-0 hover:bg-transparent tracking-wide">
                  {project.cta} <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
