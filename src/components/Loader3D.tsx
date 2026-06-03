"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";

interface Loader3DProps {
  onLoadingComplete?: () => void;
}

export default function Loader3D({ onLoadingComplete }: Loader3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const exitTriggeredRef = useRef(false);
  const sceneDataRef = useRef<{
    textMesh: THREE.Mesh | null;
    lightSweep: THREE.Mesh | null;
    particles: THREE.Points | null;
    glowPlane: THREE.Mesh | null;
    camera: THREE.PerspectiveCamera | null;
    composer: EffectComposer | null;
    bloomPass: UnrealBloomPass | null;
  }>({
    textMesh: null,
    lightSweep: null,
    particles: null,
    glowPlane: null,
    camera: null,
    composer: null,
    bloomPass: null,
  });

  const triggerExit = useCallback(() => {
    if (exitTriggeredRef.current) return;
    exitTriggeredRef.current = true;
    setIsExiting(true);

    const startTime = performance.now();
    const duration = 1200;

    const animateExit = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const data = sceneDataRef.current;
      if (data.textMesh) {
        data.textMesh.position.z = eased * 12;
        data.textMesh.scale.setScalar(1 + eased * 0.5);
        (data.textMesh.material as THREE.MeshPhysicalMaterial).opacity = 1 - eased;
      }
      if (data.glowPlane) {
        const glowMat = data.glowPlane.material as THREE.ShaderMaterial;
        glowMat.uniforms.uIntensity.value = 1.0 + eased * 3.0;
        glowMat.uniforms.uOpacity.value = 1.0 - eased;
      }
      if (data.particles) {
        (data.particles.material as THREE.PointsMaterial).opacity = 1 - eased;
      }
      if (data.bloomPass) {
        data.bloomPass.strength = 0.6 + eased * 2.0;
      }

      if (t < 1) {
        requestAnimationFrame(animateExit);
      } else {
        setIsHidden(true);
        onLoadingComplete?.();
      }
    };
    requestAnimationFrame(animateExit);
  }, [onLoadingComplete]);

  // Progress simulation
  useEffect(() => {
    let frame: number;
    let current = 0;

    const tick = () => {
      if (current < 100) {
        // Non-linear easing: fast start, slow middle, fast finish
        const remaining = 100 - current;
        let increment: number;
        if (current < 30) {
          increment = 0.8 + Math.random() * 1.2;
        } else if (current < 70) {
          increment = 0.2 + Math.random() * 0.5;
        } else if (current < 90) {
          increment = 0.4 + Math.random() * 0.8;
        } else {
          increment = 0.6 + Math.random() * remaining * 0.15;
        }
        current = Math.min(current + increment, 100);
        setProgress(Math.floor(current));
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => triggerExit(), 400);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [triggerExit]);

  // Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // ─── Renderer ─────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ─── Scene & Camera ───────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 14);
    camera.lookAt(0, 0, 0);
    sceneDataRef.current.camera = camera;

    // ─── Post-processing ──────────────────────────────
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.6,   // strength
      0.4,   // radius
      0.85   // threshold
    );
    composer.addPass(bloomPass);
    sceneDataRef.current.bloomPass = bloomPass;
    sceneDataRef.current.composer = composer;

    // Bokeh DOF
    const bokehPass = new BokehPass(scene, camera, {
      focus: 14.0,
      aperture: 0.00015,
      maxblur: 0.005,
    });
    composer.addPass(bokehPass);

    // ─── Lighting ─────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Key light - warm
    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    // Fill light - cool cyan
    const fillLight = new THREE.DirectionalLight(0x66ffcc, 0.6);
    fillLight.position.set(-5, 2, 3);
    scene.add(fillLight);

    // Rim light - mint
    const rimLight = new THREE.DirectionalLight(0x88ffdd, 0.8);
    rimLight.position.set(0, -3, -5);
    scene.add(rimLight);

    // Top light
    const topLight = new THREE.PointLight(0xaaffee, 0.5, 30);
    topLight.position.set(0, 8, 0);
    scene.add(topLight);

    // ─── HDRI-like Environment Map ────────────────────
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });

    const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

    // Create gradient environment
    const envScene = new THREE.Scene();
    const envGeo = new THREE.SphereGeometry(50, 32, 32);
    const envMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        uColor1: { value: new THREE.Color(0x0a0a0f) },
        uColor2: { value: new THREE.Color(0x1a3a4a) },
        uColor3: { value: new THREE.Color(0x0d2a2a) },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec3 vWorldPosition;
        void main() {
          float y = normalize(vWorldPosition).y;
          vec3 color = mix(uColor1, uColor2, smoothstep(-0.5, 0.5, y));
          color = mix(color, uColor3, smoothstep(0.0, 1.0, abs(y)));
          // Add subtle highlights for reflections
          float highlight = pow(max(0.0, dot(normalize(vWorldPosition), vec3(1.0, 0.5, 0.5))), 8.0);
          color += vec3(0.05, 0.1, 0.08) * highlight;
          float highlight2 = pow(max(0.0, dot(normalize(vWorldPosition), vec3(-0.5, 0.3, 0.8))), 6.0);
          color += vec3(0.03, 0.08, 0.1) * highlight2;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    envScene.add(new THREE.Mesh(envGeo, envMat));

    // Add point lights to env scene for reflections
    const envLight1 = new THREE.PointLight(0x66ffcc, 5, 100);
    envLight1.position.set(10, 5, 10);
    envScene.add(envLight1);
    const envLight2 = new THREE.PointLight(0x88ffdd, 3, 100);
    envLight2.position.set(-10, 3, -5);
    envScene.add(envLight2);

    cubeCamera.position.set(0, 0, 0);
    cubeCamera.update(renderer, envScene);

    // ─── 3D Text ──────────────────────────────────────
    const fontLoader = new FontLoader();
    fontLoader.load(
      "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/fonts/droid/droid_sans_bold_typeface.json",
      (font) => {
        const textGeo = new TextGeometry("PRAJWAL", {
          font,
          size: 1.6,
          depth: 0.6,
          curveSegments: 24,
          bevelEnabled: true,
          bevelThickness: 0.06,
          bevelSize: 0.04,
          bevelOffset: 0,
          bevelSegments: 8,
        });

        textGeo.computeBoundingBox();
        const center = new THREE.Vector3();
        textGeo.boundingBox!.getCenter(center);
        textGeo.translate(-center.x, -center.y, -center.z);

        // Glassmorphism + metallic material
        const textMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0.3,
          roughness: 0.08,
          transmission: 0.15,
          thickness: 0.5,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          ior: 1.5,
          envMap: cubeRenderTarget.texture,
          envMapIntensity: 2.0,
          transparent: true,
          opacity: 1.0,
          reflectivity: 1.0,
          sheen: 0.5,
          sheenRoughness: 0.3,
          sheenColor: new THREE.Color(0x88ffdd),
        });

        const textMesh = new THREE.Mesh(textGeo, textMaterial);
        textMesh.castShadow = true;
        textMesh.receiveShadow = true;
        scene.add(textMesh);
        sceneDataRef.current.textMesh = textMesh;

        // ─── Light Sweep ──────────────────────────────
        const sweepGeo = new THREE.PlaneGeometry(0.3, 5);
        const sweepMat = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uOpacity: { value: 0.0 },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            uniform float uOpacity;
            void main() {
              float alpha = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
              alpha *= uOpacity;
              vec3 color = mix(vec3(0.4, 1.0, 0.85), vec3(1.0), vUv.y * 0.5);
              gl_FragColor = vec4(color, alpha * 0.6);
            }
          `,
        });
        const lightSweep = new THREE.Mesh(sweepGeo, sweepMat);
        lightSweep.position.z = 0.5;
        lightSweep.rotation.z = Math.PI * 0.15;
        scene.add(lightSweep);
        sceneDataRef.current.lightSweep = lightSweep;
      }
    );

    // ─── Particles ────────────────────────────────────
    const particleCount = 300;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Distribute around text area
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 8;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      velocities[i * 3] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
      sizes[i] = Math.random() * 3 + 0.5;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0x88ffdd,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    sceneDataRef.current.particles = particles;

    // ─── Glow Beneath Text ────────────────────────────
    const glowGeo = new THREE.PlaneGeometry(12, 4);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uIntensity: { value: 1.0 },
        uOpacity: { value: 1.0 },
        uTime: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uIntensity;
        uniform float uOpacity;
        uniform float uTime;
        void main() {
          vec2 center = vUv - vec2(0.5);
          float dist = length(center * vec2(1.0, 2.0));
          float glow = exp(-dist * dist * 6.0) * uIntensity;
          // Animated color shift
          vec3 cyan = vec3(0.35, 0.9, 0.75);
          vec3 mint = vec3(0.5, 1.0, 0.85);
          vec3 color = mix(cyan, mint, sin(uTime * 0.5) * 0.5 + 0.5);
          gl_FragColor = vec4(color * glow * 0.35, glow * 0.5 * uOpacity);
        }
      `,
    });
    const glowPlane = new THREE.Mesh(glowGeo, glowMat);
    glowPlane.position.y = -2.2;
    glowPlane.position.z = -0.5;
    glowPlane.rotation.x = -Math.PI * 0.3;
    scene.add(glowPlane);
    sceneDataRef.current.glowPlane = glowPlane;

    // ─── Animation Loop ───────────────────────────────
    const clock = new THREE.Clock();
    let sweepCycle = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      const data = sceneDataRef.current;

      // Text floating animation
      if (data.textMesh && !exitTriggeredRef.current) {
        // Gentle floating
        data.textMesh.position.y = Math.sin(elapsed * 0.8) * 0.15;
        data.textMesh.position.x = Math.sin(elapsed * 0.5) * 0.05;

        // Slow Y rotation
        data.textMesh.rotation.y = Math.sin(elapsed * 0.3) * 0.12;
        data.textMesh.rotation.x = Math.sin(elapsed * 0.4) * 0.02;

        // Scale pulse every ~2 seconds
        const pulseFactor = 1 + Math.sin(elapsed * Math.PI) * 0.015;
        data.textMesh.scale.setScalar(pulseFactor);
      }

      // Light sweep animation
      if (data.lightSweep) {
        sweepCycle = (elapsed % 4.5) / 4.5; // sweep every 4.5s
        const sweepX = -8 + sweepCycle * 16;
        data.lightSweep.position.x = sweepX;

        const sweepMat = data.lightSweep.material as THREE.ShaderMaterial;
        // Fade in/out at edges
        const sweepAlpha = Math.sin(sweepCycle * Math.PI);
        sweepMat.uniforms.uOpacity.value = sweepAlpha * 0.8;
      }

      // Glow animation
      if (data.glowPlane) {
        const glowMat = data.glowPlane.material as THREE.ShaderMaterial;
        glowMat.uniforms.uTime.value = elapsed;
        if (!exitTriggeredRef.current) {
          glowMat.uniforms.uIntensity.value = 0.8 + Math.sin(elapsed * 1.5) * 0.2;
        }
      }

      // Particle drift
      if (data.particles) {
        const posAttr = data.particles.geometry.getAttribute("position");
        const posArray = posAttr.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          posArray[i * 3] += velocities[i * 3];
          posArray[i * 3 + 1] += velocities[i * 3 + 1];
          posArray[i * 3 + 2] += velocities[i * 3 + 2];

          // Gentle orbit
          const x = posArray[i * 3];
          const z = posArray[i * 3 + 2];
          const dist = Math.sqrt(x * x + z * z);
          if (dist > 0.1) {
            const orbitSpeed = 0.0003;
            posArray[i * 3] += -z / dist * orbitSpeed;
            posArray[i * 3 + 2] += x / dist * orbitSpeed;
          }

          // Respawn if too far
          const totalDist = Math.sqrt(
            posArray[i * 3] ** 2 +
            posArray[i * 3 + 1] ** 2 +
            posArray[i * 3 + 2] ** 2
          );
          if (totalDist > 12) {
            const angle = Math.random() * Math.PI * 2;
            const r = 3 + Math.random() * 4;
            posArray[i * 3] = Math.cos(angle) * r;
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 4;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
          }
        }
        posAttr.needsUpdate = true;

        // Slow rotation of entire particle system
        data.particles.rotation.y += 0.0003;
      }

      // Camera subtle breathing
      if (data.camera && !exitTriggeredRef.current) {
        data.camera.position.x = Math.sin(elapsed * 0.2) * 0.1;
        data.camera.position.y = 0.5 + Math.sin(elapsed * 0.3) * 0.05;
      }

      composer.render();
    };

    animate();

    // ─── Resize Handler ───────────────────────────────
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      composer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (isHidden) return null;

  // Format progress for display
  const displayProgress = Math.min(progress, 100);
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (circumference * displayProgress) / 100;

  return (
    <div
      id="loader-3d-container"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0f",
        opacity: isExiting ? 0 : 1,
        transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: isExiting ? "none" : "auto",
      }}
    >
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
        }}
      />

      {/* Loading UI Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          opacity: isExiting ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      >
        {/* Circular Progress Ring */}
        <div style={{ position: "relative", width: 100, height: 100 }}>
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(136, 255, 221, 0.08)"
              strokeWidth="2"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: "stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: "drop-shadow(0 0 6px rgba(136, 255, 221, 0.4))",
              }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#66ffcc" />
                <stop offset="50%" stopColor="#88ffdd" />
                <stop offset="100%" stopColor="#aaffee" />
              </linearGradient>
            </defs>
          </svg>
          {/* Percentage text */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily:
                "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: 300,
                color: "rgba(255, 255, 255, 0.9)",
                letterSpacing: "1px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {displayProgress}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 300,
                color: "rgba(136, 255, 221, 0.6)",
                marginLeft: "1px",
                marginTop: "2px",
              }}
            >
              %
            </span>
          </div>
        </div>

        {/* Loading text */}
        <p
          style={{
            fontSize: "11px",
            fontWeight: 300,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.3)",
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            margin: 0,
          }}
        >
          Loading
        </p>
      </div>

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(10, 10, 15, 0.6) 100%)",
        }}
      />

      {/* Top subtle gradient line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(136, 255, 221, 0.15), transparent)",
        }}
      />
    </div>
  );
}
