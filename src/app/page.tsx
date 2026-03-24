import ScrollyCanvas from "@/components/ScrollyCanvas";
import TechMarquee from "@/components/TechMarquee";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <main className="bg-[#121212] min-h-screen text-white selection:bg-white/30 selection:text-white">
      <ScrollyCanvas />
      <TechMarquee />
      <Projects />
    </main>
  );
}
