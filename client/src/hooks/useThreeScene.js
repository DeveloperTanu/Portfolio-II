import { useEffect } from 'react';
import * as THREE from 'three';
import { useMotion } from '../context/MotionContext.jsx';

export default function useThreeScene(canvasRef, factory, opts = {}) {
  const zoom = opts.zoom || 1;
  const hitRadius = opts.hitRadius || 0;
  const { motion } = useMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (!motion) { canvas.style.display = 'none'; return undefined; }
    canvas.style.display = '';
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      canvas.style.display = 'none';
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6 * zoom;
    const inst = factory({ scene, camera, mobile: window.innerWidth < 768 });
    if (opts.instRef) opts.instRef.current = inst;
    const box = canvas.parentElement;
    const p = { x: 0, y: 0 }, target = { x: 0, y: 0 };
    const ptr = { inside: false, wx: 0, wy: 0 };
    const mouse = { x: 0, y: 0, has: false, type: 'mouse', down: false, until: 0 };
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(22.5));
    let visible = false, raf = 0, t = 0, last = performance.now();

    const progress = () => {
      const r = box.getBoundingClientRect(), vh = window.innerHeight;
      return Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    };
    const resize = () => {
      const w = box.clientWidth, h = box.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const hitTest = (pr, now) => {
      if (!hitRadius || !mouse.has) { ptr.inside = false; return; }
      const live = mouse.type === 'mouse' || mouse.down || now < mouse.until;
      const r = canvas.getBoundingClientRect();
      const aspect = r.width / r.height;
      const nx = ((mouse.x - r.left) / r.width) * 2 - 1, ny = -(((mouse.y - r.top) / r.height) * 2 - 1);
      const camZ = 6 * zoom;
      const hr = inst.hit ? inst.hit(pr) : hitRadius * (1 + pr * 0.5);
      const ry = hr / (camZ * tanHalf), rx = ry / aspect;
      ptr.inside = live && (nx * nx) / (rx * rx) + (ny * ny) / (ry * ry) < 1;
      if (ptr.inside) { ptr.wx = nx * camZ * tanHalf * aspect; ptr.wy = ny * camZ * tanHalf; }
    };
    const draw = (now = performance.now()) => {
      const pr = progress();
      hitTest(pr, now);
      inst.update(t, p, pr, ptr);
      renderer.render(scene, camera);
    };
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      t += Math.min(0.05, (now - last) / 1000); last = now;
      p.x += (target.x - p.x) * 0.06; p.y += (target.y - p.y) * 0.06;
      draw(now);
    };
    const start = () => { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop); };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1; target.y = -((e.clientY / window.innerHeight) * 2 - 1);
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.has = true; mouse.type = e.pointerType;
    };
    const onDown = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.has = true; mouse.type = e.pointerType; mouse.down = true; };
    const onUp = (e) => { mouse.down = false; if (e.pointerType !== 'mouse') mouse.until = performance.now() + 1400; };
    const onLeave = () => { mouse.has = false; };

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (!visible) cancelAnimationFrame(raf);
      else if (motion) start(); else draw();
    }, { rootMargin: '100px' });
    const ro = new ResizeObserver(() => { resize(); if (!motion && visible) draw(); });
    const onScroll = () => { if (!motion && visible) draw(); };

    resize(); io.observe(box); ro.observe(box);
    window.addEventListener('pointermove', onMove, { passive: true });
    if (hitRadius) {
      window.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      window.addEventListener('pointercancel', onUp, { passive: true });
      document.addEventListener('pointerleave', onLeave);
    }
    if (!motion) window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      if (opts.instRef) opts.instRef.current = null;
      inst.dispose();
      renderer.dispose();
    };
  }, [motion, canvasRef, factory, zoom, hitRadius]);
}
