'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
export default function LoopScene() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      el.clientWidth / el.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 8);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    const group = new THREE.Group();
    scene.add(group);
    const geo = new THREE.TorusKnotGeometry(1.25, 0.34, 220, 18, 2, 3);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xe52b22,
      metalness: 0.55,
      roughness: 0.24,
      wireframe: false,
    });
    const knot = new THREE.Mesh(geo, mat);
    group.add(knot);
    const wire = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.28, 0.345, 120, 8, 2, 3),
      new THREE.MeshBasicMaterial({
        color: 0x171514,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      }),
    );
    group.add(wire);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x76635a, 2));
    const light = new THREE.PointLight(0xffffff, 35);
    light.position.set(3, 4, 5);
    scene.add(light);
    const red = new THREE.PointLight(0xe52b22, 20);
    red.position.set(-4, -2, 2);
    scene.add(red);
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    const pointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 0.7;
      my = ((e.clientY - r.top) / r.height - 0.5) * 0.45;
    };
    el.addEventListener('pointermove', pointer);
    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      rx += (my - rx) * 0.035;
      ry += (mx - ry) * 0.035;
      group.rotation.x = rx + Math.sin(Date.now() * 0.00025) * 0.08;
      group.rotation.y = Date.now() * 0.00022 + ry;
      knot.rotation.z = Math.sin(Date.now() * 0.0003) * 0.15;
      renderer.render(scene, camera);
    };
    render();
    const resize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      el.removeEventListener('pointermove', pointer);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);
  return (
    <div
      className="loop-scene"
      ref={host}
      aria-label="Interactive 3D endless-loop sculpture"
    />
  );
}
