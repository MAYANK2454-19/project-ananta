'use client';

import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import styles from './HeroSculpture.module.css';

/**
 * A small, decorative Three.js loop behind the hero collage. It is client-only,
 * pauses off-screen, and renders a still frame when reduced motion is enabled.
 */
export function HeroSculpture() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let visible = true;
    let prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let frame = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let sculpture: THREE.Group | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let fallbackResize: (() => void) | null = null;
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    const renderFrame = () => {
      if (disposed || !renderer || !scene || !camera) return;
      renderer.render(scene, camera);
    };

    const stopAnimation = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const animate = () => {
      frame = 0;
      if (
        disposed ||
        !visible ||
        prefersReducedMotion ||
        !renderer ||
        !scene ||
        !camera
      ) {
        renderFrame();
        return;
      }

      if (sculpture) {
        sculpture.rotation.y += 0.0022;
        sculpture.rotation.x += 0.00065;
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (disposed) return;
      stopAnimation();
      if (prefersReducedMotion || !visible) {
        renderFrame();
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };

    const resize = () => {
      if (!renderer || !camera || !host) return;
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderFrame();
    };

    const boot = async () => {
      try {
        const THREE = await import('three');
        if (disposed) return;

        const width = Math.max(1, host.clientWidth);
        const height = Math.max(1, host.clientHeight);
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(width, height, false);
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.domElement.setAttribute('aria-hidden', 'true');
        renderer.domElement.className = styles.canvas;
        host.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
        camera.position.set(0, 0, 4.3);

        const group = new THREE.Group();
        sculpture = group;
        const knotGeometry = new THREE.TorusKnotGeometry(0.86, 0.205, 180, 18, 2, 3);
        const knotMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xc48b3b,
          metalness: 0.68,
          roughness: 0.28,
          clearcoat: 0.8,
          clearcoatRoughness: 0.24,
        });
        geometries.push(knotGeometry);
        materials.push(knotMaterial);
        const knot = new THREE.Mesh(knotGeometry, knotMaterial);
        knot.rotation.set(0.25, 0.1, -0.18);
        group.add(knot);

        const orbitGeometry = new THREE.TorusGeometry(1.16, 0.012, 8, 140);
        const orbitMaterial = new THREE.MeshStandardMaterial({
          color: 0x29251e,
          metalness: 0.35,
          roughness: 0.5,
          transparent: true,
          opacity: 0.48,
        });
        geometries.push(orbitGeometry);
        materials.push(orbitMaterial);
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.set(1.05, 0.35, 0.1);
        group.add(orbit);

        scene.add(group);
        scene.add(new THREE.AmbientLight(0xffffff, 1.75));

        const warmLight = new THREE.DirectionalLight(0xffe1ae, 3.2);
        warmLight.position.set(-3, 4, 5);
        scene.add(warmLight);

        const rimLight = new THREE.DirectionalLight(0x78899a, 1.6);
        rimLight.position.set(4, -2, -3);
        scene.add(rimLight);

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(resize);
          resizeObserver.observe(host);
        } else {
          fallbackResize = resize;
          window.addEventListener('resize', fallbackResize);
        }

        if (typeof IntersectionObserver !== 'undefined') {
          intersectionObserver = new IntersectionObserver(([entry]) => {
            visible = Boolean(entry?.isIntersecting);
            if (visible) startAnimation();
            else stopAnimation();
          });
          intersectionObserver.observe(host);
        }

        startAnimation();
      } catch {
        // Keep the CSS loop fallback visible when WebGL is unavailable.
      }
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      startAnimation();
    };
    motionQuery.addEventListener('change', onMotionChange);

    void boot();

    return () => {
      disposed = true;
      stopAnimation();
      motionQuery.removeEventListener('change', onMotionChange);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (fallbackResize) window.removeEventListener('resize', fallbackResize);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return (
    <div ref={hostRef} className={styles.sculpture} aria-hidden="true">
      <span className={styles.fallbackRing} />
      <span className={styles.fallbackOrbit} />
    </div>
  );
}
