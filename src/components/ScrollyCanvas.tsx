"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Overlay from "./Overlay";

const FRAME_COUNT = 90;
const FRAME_PREFIX = "ezgif-frame-";
const FRAME_SUFFIX = ".png";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const withBasePath = (path: string) =>
  `${BASE_PATH}${path}`;

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(3, "0");
      img.src = withBasePath(`/sequence/${FRAME_PREFIX}${frameNumber}${FRAME_SUFFIX}`);
      
      img.onload = () => {
        // Render first frame as soon as it's ready
        if (i === 1) {
          drawFrame(img);
        }
      };
      
      loadedImages.push(img);
    }
    setImages(loadedImages);

    const handleResize = () => {
      // Re-draw current frame on resize
      const currentProgress = scrollYProgress.get();
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(currentProgress * FRAME_COUNT)
      );
      if (loadedImages[frameIndex] && loadedImages[frameIndex].complete) {
        drawFrame(loadedImages[frameIndex]);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const drawFrame = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use dpr for sharp canvas rendering on high density displays
    const dpr = window.devicePixelRatio || 1;
    const cw = window.innerWidth;
    const ch = window.innerHeight;

    canvas.width = cw * dpr;
    canvas.height = ch * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, cw, ch);

    // Calculate object-fit: cover dynamically
    const hRatio = cw / img.width;
    const vRatio = ch / img.height;
    const ratio = Math.max(hRatio, vRatio);

    const centerShift_x = (cw - img.width * ratio) / 2;
    const centerShift_y = (ch - img.height * ratio) / 2;

    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (images.length === 0) return;
    
    // Smoothly scrub through sequence based on scroll progress
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(latest * FRAME_COUNT)
    );
    
    const img = images[frameIndex];
    if (img && img.complete) {
      drawFrame(img);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#121212]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 block w-full h-full" 
        />
        <Overlay scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
