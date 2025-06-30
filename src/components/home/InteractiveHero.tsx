// src/components/home/InteractiveHero.tsx
// This component is now updated to accept a list of HeroImage objects.
"use client";

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';
import { HeroImage } from '@/types/data';

interface InteractiveHeroProps {
  heroImages: HeroImage[];
}

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function InteractiveHero({ heroImages }: InteractiveHeroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const targetRotation = useRef(0);
  const mouseX = useRef(0);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount || heroImages.length === 0) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const group = new THREE.Group();
    groupRef.current = group;
    const textureLoader = new THREE.TextureLoader();
    const radius = 3.5;

    heroImages.forEach((image, i) => {
        const texture = textureLoader.load(
            image.url || 'https://placehold.co/500x500/png?text=Image',
            () => {}, undefined,
            () => {
                console.error(`Failed to load texture for ${image.alt}`);
                const errorTexture = textureLoader.load('https://placehold.co/500x500/png?text=Error');
                plane.material.map = errorTexture;
                plane.material.needsUpdate = true;
            }
        );
      
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
      const geometry = new THREE.PlaneGeometry(2.5, 2.5); // Slightly larger planes
      const plane = new THREE.Mesh(geometry, material);

      const angle = (i / heroImages.length) * Math.PI * 2;
      plane.position.x = Math.sin(angle) * radius;
      plane.position.z = Math.cos(angle) * radius;
      plane.rotation.y = -angle;

      group.add(plane);
    });
    scene.add(group);

    let currentRotation = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      currentRotation = lerp(currentRotation, targetRotation.current, 0.05);
      if(groupRef.current) groupRef.current.rotation.y = currentRotation;

      let closestAngleDiff = Infinity;
      let frontIndex = 0;
      const planes = groupRef.current?.children || [];
      
      planes.forEach((plane, i) => {
        const worldAngle = plane.rotation.y + groupRef.current!.rotation.y;
        const normalizedAngle = (worldAngle % (Math.PI * 2) + (Math.PI * 2)) % (Math.PI * 2);
        const angleDiff = Math.abs(normalizedAngle > Math.PI ? normalizedAngle - (2 * Math.PI) : normalizedAngle);

        if (angleDiff < closestAngleDiff) {
          closestAngleDiff = angleDiff;
          frontIndex = i;
        }
      });
      
      // A small optimization to avoid unnecessary state updates
      if (activeIndex !== frontIndex) {
        setActiveIndex(frontIndex);
      }

      renderer.render(scene, camera);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.current = (event.clientX / window.innerWidth) * 2 - 1;
      targetRotation.current = mouseX.current * Math.PI * 0.15; // Reduced sensitivity
    };

    const handleResize = () => {
      if (mountRef.current && rendererRef.current && cameraRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if(currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [heroImages, activeIndex]); // Added activeIndex to dependencies

  const activeImage = heroImages[activeIndex];

  return (
    <section className="relative w-full h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-10 opacity-90" />
      
      <div className="absolute inset-0 z-20 flex flex-col justify-end items-center p-8 pointer-events-none">
        <div className="text-center transition-all duration-500 ease-in-out">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider drop-shadow-lg" key={`title-${activeIndex}`}>
            {activeImage?.product_name || 'Hampback Gear'}
          </h1>
          <p className="text-xl text-purple-300 drop-shadow-md" key={`cat-${activeIndex}`}>
            {activeImage?.category_name || 'Featured Product'}
          </p>
          <Link 
            href={activeImage?.product_slug ? `/product/${activeImage.product_slug}` : '/products'} 
            className="mt-6 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg pointer-events-auto"
          >
            View Details
          </Link>
        </div>
      </div>
    </section>
  );
}
