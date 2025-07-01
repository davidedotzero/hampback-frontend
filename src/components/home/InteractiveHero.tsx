// src/components/home/InteractiveHero.tsx
// This component is updated to fade out non-active images for better focus.
"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import Link from 'next/link';
import { HeroImage } from '@/types/data';

interface InteractiveHeroProps {
  heroImages: HeroImage[];
}

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function InteractiveHero({ heroImages }: InteractiveHeroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const baseRotation = useRef(0);
  const mouseRotationOffset = useRef(0);
  const groupRef = useRef<THREE.Group | null>(null);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);


  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount || heroImages.length === 0) return;

    // --- Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // --- Create 3D Objects ---
    const group = new THREE.Group();
    groupRef.current = group;
    const textureLoader = new THREE.TextureLoader();
    const radius = 3.5;

    heroImages.forEach((image, i) => {
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(image.url)}`;
        const texture = textureLoader.load(proxyUrl);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
        const geometry = new THREE.PlaneGeometry(2.5, 2.5);
        const plane = new THREE.Mesh(geometry, material);
        plane.userData.id = i; // Store index for later checks
        const angle = (i / heroImages.length) * Math.PI * 2;
        plane.position.x = Math.sin(angle) * radius;
        plane.position.z = Math.cos(angle) * radius;
        group.add(plane);
    });
    scene.add(group);

    // --- Logic to calculate the shortest rotation path ---
    const anglePerItem = (Math.PI * 2) / heroImages.length;
    const newTargetAngle = -activeIndex * anglePerItem;
    
    let diff = newTargetAngle - baseRotation.current;
    if (Math.abs(diff) > Math.PI) {
        if (diff > 0) {
            diff -= Math.PI * 2;
        } else {
            diff += Math.PI * 2;
        }
    }
    baseRotation.current += diff;

    // --- Animation Loop & Interaction ---
    let currentRotation = group.rotation.y;
    const animate = () => {
      requestAnimationFrame(animate);
      
      const finalTargetRotation = baseRotation.current + mouseRotationOffset.current;
      currentRotation = lerp(currentRotation, finalTargetRotation, 0.03);
      group.rotation.y = currentRotation;

      // ** THE FIX: Adjust opacity based on the active index **
      group.children.forEach(plane => {
        plane.lookAt(camera.position);

        // Ensure we are working with a Mesh with the correct material type
        if (plane instanceof THREE.Mesh && plane.material instanceof THREE.MeshBasicMaterial) {
            // Determine the target opacity: 1 for active, 0.3 for inactive
            const targetOpacity = plane.userData.id === activeIndex ? 1.0 : 0.3;
            // Smoothly transition the opacity
            plane.material.opacity = lerp(plane.material.opacity, targetOpacity, 0.05);
        }
      });

      renderer.render(scene, camera);
    };

    const handleMouseMove = (event: MouseEvent) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRotationOffset.current = mouseX * Math.PI * 0.05;
    };

    const handleResize = () => {
        if (currentMount) {
            const width = currentMount.clientWidth;
            const height = currentMount.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if(currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [heroImages, activeIndex]);

  const activeImage = heroImages[activeIndex];

  return (
    <section className="relative w-full h-[75vh] min-h-[500px] bg-white text-black overflow-hidden">
      {/* 3D Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-10" />
      
      {/* Text Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end items-center p-8 pointer-events-none">
        <div className="text-center transition-all duration-500 ease-in-out mb-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider drop-shadow-lg" key={`title-${activeIndex}`}>
            {activeImage?.product_name || 'Hampback Gear'}
          </h1>
          <p className="text-xl text-purple-300 drop-shadow-md mt-2" key={`cat-${activeIndex}`}>
            {activeImage?.category_name || 'Featured Product'}
          </p>
        </div>
        
        {/* Dot Navigation */}
        <div className="flex items-center justify-center gap-3 pointer-events-auto">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'bg-black scale-125' : 'bg-black/50 hover:bg-black/75'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
