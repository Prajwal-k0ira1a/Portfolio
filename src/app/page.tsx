"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import TechMarquee from "@/components/TechMarquee";
import Projects from "@/components/Projects";
import ContactCta from "@/components/ContactCta";
import Footer from "@/components/Footer";

const AxiomPreloader = dynamic(() => import("@/components/AxiomPreloader"), {
  ssr: false,
});

const FRAME_COUNT = 90;
const FRAME_PREFIX = "ezgif-frame-";
const FRAME_SUFFIX = ".png";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Preload all sequence images and report progress
  const handlePreload = useCallback(() => {
    return new Promise<void>((resolve) => {
      let loadedCount = 0;

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(3, "0");
        img.src = `${BASE_PATH}/sequence/${FRAME_PREFIX}${frameNumber}${FRAME_SUFFIX}`;

        const onDone = () => {
          loadedCount++;
          setLoadProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
          if (loadedCount >= FRAME_COUNT) {
            resolve();
          }
        };

        img.onload = onDone;
        img.onerror = onDone; // don't block on broken frames
      }
    });
  }, []);

  return (
    <>
      {!loaded && (
        <AxiomPreloader
          logoText="Prajwal Koirala"
          preloadFn={handlePreload}
          externalProgress={loadProgress}
          onComplete={() => setLoaded(true)}
        />
      )}
      {loaded && (
        <main className="bg-[#121212] min-h-screen text-white selection:bg-white/30 selection:text-white">
          <ScrollyCanvas />
          <TechMarquee />
          <Projects />
          <ContactCta />
          <Footer />
        </main>
      )}
    </>
  );
}
