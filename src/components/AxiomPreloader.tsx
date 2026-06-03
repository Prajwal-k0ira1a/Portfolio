"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AxiomPreloaderProps {
  logoText?: string;
  /** Async function that loads assets. Loader waits for it to resolve. */
  preloadFn?: () => Promise<void>;
  /** Real loading progress 0–100 driven by the parent */
  externalProgress?: number;
  /** Legacy: minimum duration in ms (ignored when preloadFn is provided) */
  duration?: number;
  onComplete?: () => void;
}

export default function AxiomPreloader({
  logoText = "PRAJWAL",
  preloadFn,
  externalProgress,
  duration = 4000,
  onComplete,
}: AxiomPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");
  const [lettersRevealed, setLettersRevealed] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const assetsReadyRef = useRef(false);
  const minTimePassedRef = useRef(false);

  // ─── Particle canvas ───────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;
      hue: number;
    }

    const particles: Particle[] = [];
    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const spawnParticle = () => {
      const centerX = w() / 2;
      const centerY = h() / 2 - 20;
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 200;
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: 0,
        life: 0,
        maxLife: 120 + Math.random() * 180,
        hue: 160 + Math.random() * 30,
      });
    };

    let frame = 0;
    const loop = () => {
      animFrameRef.current = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, w(), h());
      frame++;

      if (frame % 3 === 0 && particles.length < 60) {
        spawnParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) {
          p.opacity = lifeRatio / 0.15;
        } else if (lifeRatio > 0.7) {
          p.opacity = (1 - lifeRatio) / 0.3;
        }

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.opacity * 0.5})`;
        ctx.fill();

        // glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.opacity * 0.08})`;
        ctx.fill();
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ─── Attempt to trigger exit when BOTH conditions are met ───
  const tryExit = useCallback(() => {
    if (assetsReadyRef.current && minTimePassedRef.current) {
      setProgress(100);
      setLettersRevealed(logoText.length);
      setTimeout(() => setPhase("exiting"), 600);
    }
  }, [logoText]);

  // ─── Kick off preloading + minimum display timer ──────────
  useEffect(() => {
    // Minimum time the loader is visible (so the animation looks intentional)
    const minTimer = setTimeout(() => {
      minTimePassedRef.current = true;
      tryExit();
    }, Math.max(duration, 2500));

    // Start actual asset preloading
    if (preloadFn) {
      preloadFn().then(() => {
        assetsReadyRef.current = true;
        tryExit();
      });
    } else {
      // Fallback: no preload function means assets are "ready" immediately
      assetsReadyRef.current = true;
    }

    return () => clearTimeout(minTimer);
  }, [preloadFn, duration, tryExit]);

  // ─── Progress: blend real loading + smooth animation ───────
  useEffect(() => {
    if (externalProgress === undefined) {
      // Fallback: fake progress when no external source
      const startTime = performance.now();
      let raf: number;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const raw = Math.min(elapsed / duration, 1);
        let eased: number;
        if (raw < 0.3) eased = (raw / 0.3) * 35;
        else if (raw < 0.7) eased = 35 + ((raw - 0.3) / 0.4) * 40;
        else eased = 75 + ((raw - 0.7) / 0.3) ** 2 * 25;

        setProgress(Math.min(Math.floor(eased), 99));
        if (raw < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }
    return;
  }, [duration, externalProgress]);

  // When external progress updates, smoothly follow it
  useEffect(() => {
    if (externalProgress !== undefined) {
      // Cap at 99 until both conditions pass, then jump to 100 in tryExit
      setProgress(Math.min(externalProgress, 99));
    }
  }, [externalProgress]);

  // ─── Letter reveal tied to progress ────────────────────────
  useEffect(() => {
    const letterProgress = Math.min(progress / 55, 1); // reveal over first 55%
    const totalLetters = logoText.length;
    setLettersRevealed(Math.floor(letterProgress * totalLetters));
  }, [progress, logoText]);

  // ─── Exit phase ────────────────────────────────────
  useEffect(() => {
    if (phase === "exiting") {
      const timer = setTimeout(() => {
        setPhase("done");
        onComplete?.();
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  if (phase === "done") return null;

  const circumference = 2 * Math.PI * 52;
  const strokeOffset = circumference - (circumference * progress) / 100;

  return (
    <div
      className="axiom-preloader"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#06060a",
        overflow: "hidden",
        opacity: phase === "exiting" ? 0 : 1,
        transition: "opacity 1s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: phase === "exiting" ? 0 : 0.8,
          transition: "opacity 0.8s ease",
        }}
      />

      {/* Ambient glow behind text */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(100,255,200,0.06) 0%, rgba(80,220,180,0.02) 40%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          transform: phase === "exiting" ? "scale(2)" : "scale(1)",
          opacity: phase === "exiting" ? 0 : 1,
          transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Main logo text */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          gap: "0.02em",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "90vw",
          transform:
            phase === "exiting"
              ? "translateY(-30px) scale(1.08)"
              : "translateY(0) scale(1)",
          opacity: phase === "exiting" ? 0 : 1,
          transition: "all 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {logoText.split("").map((char, i) => {
          const isRevealed = i < lettersRevealed;
          const staggerDelay = i * 60;
          const isSpace = char === " ";

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                fontWeight: 200,
                letterSpacing: "0.15em",
                fontFamily:
                  "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
                color: isRevealed ? "rgba(255, 255, 255, 0.93)" : "rgba(255,255,255,0)",
                textShadow: isRevealed
                  ? "0 0 40px rgba(100,255,200,0.15), 0 0 80px rgba(100,255,200,0.05)"
                  : "none",
                transform: isRevealed
                  ? "translateY(0) scale(1)"
                  : "translateY(20px) scale(0.9)",
                opacity: isRevealed ? 1 : 0,
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}ms`,
                willChange: "transform, opacity",
                width: isSpace ? "0.35em" : "auto",
                minWidth: isSpace ? "0.35em" : undefined,
              }}
            >
              {isSpace ? "\u00A0" : char}
            </span>
          );
        })}
      </div>

      {/* Light sweep across text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: "120px",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          zIndex: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "80px",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
            animation: "axiomSweep 3.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Subtitle line */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: "1.5rem",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: 300,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
            margin: 0,
            transform: progress > 10 ? "translateY(0)" : "translateY(100%)",
            opacity: progress > 10 ? 1 : 0,
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          Portfolio
        </p>
      </div>

      {/* Progress section */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          zIndex: 2,
          opacity: phase === "exiting" ? 0 : 1,
          transform: phase === "exiting" ? "translateY(20px)" : "translateY(0)",
          transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Circular progress ring */}
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Track */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
            {/* Progress arc */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="url(#axiomGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              style={{
                transition: "stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: "drop-shadow(0 0 4px rgba(100,255,200,0.3))",
              }}
            />
            <defs>
              <linearGradient id="axiomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(100,255,200,0.8)" />
                <stop offset="50%" stopColor="rgba(136,255,221,0.6)" />
                <stop offset="100%" stopColor="rgba(170,255,238,0.4)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Percentage in center */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "1.4rem",
                fontWeight: 200,
                color: "rgba(255,255,255,0.85)",
                fontFamily:
                  "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "0.05em",
              }}
            >
              {progress}
            </span>
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 300,
                color: "rgba(100,255,200,0.4)",
                marginLeft: "2px",
                marginTop: "4px",
              }}
            >
              %
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal progress bar (minimal) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "rgba(255,255,255,0.03)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, rgba(100,255,200,0.3), rgba(100,255,200,0.6))",
            boxShadow: "0 0 12px rgba(100,255,200,0.2)",
            transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>

      {/* Corner accents */}
      <div style={{ position: "absolute", top: "24px", left: "24px", zIndex: 2 }}>
        <div
          style={{
            width: "20px",
            height: "1px",
            background: "rgba(255,255,255,0.08)",
            marginBottom: "6px",
          }}
        />
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "rgba(255,255,255,0.08)",
          }}
        />
      </div>
      <div style={{ position: "absolute", top: "24px", right: "24px", zIndex: 2 }}>
        <div
          style={{
            width: "20px",
            height: "1px",
            background: "rgba(255,255,255,0.08)",
            marginLeft: "auto",
            marginBottom: "6px",
          }}
        />
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "rgba(255,255,255,0.08)",
            marginLeft: "auto",
          }}
        />
      </div>
      <div style={{ position: "absolute", bottom: "24px", left: "24px", zIndex: 2 }}>
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "rgba(255,255,255,0.08)",
            marginBottom: "6px",
          }}
        />
        <div
          style={{
            width: "20px",
            height: "1px",
            background: "rgba(255,255,255,0.08)",
          }}
        />
      </div>
      <div style={{ position: "absolute", bottom: "24px", right: "24px", zIndex: 2 }}>
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "rgba(255,255,255,0.08)",
            marginLeft: "auto",
            marginBottom: "6px",
          }}
        />
        <div
          style={{
            width: "20px",
            height: "1px",
            background: "rgba(255,255,255,0.08)",
            marginLeft: "auto",
          }}
        />
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(6,6,10,0.7) 100%)",
          zIndex: 1,
        }}
      />

      {/* Keyframes */}
      <style>{`
        @keyframes axiomSweep {
          0% { left: -80px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
