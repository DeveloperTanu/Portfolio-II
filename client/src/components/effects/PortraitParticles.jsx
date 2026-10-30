import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMotion } from '../../context/MotionContext.jsx';

const VERT = `
  attribute vec2 aUv;
  attribute vec4 aSeed;
  attribute vec2 aTone;
  uniform vec2 uRes;
  uniform vec4 uRect;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uShift;
  uniform float uSize;
  uniform float uDpr;
  varying float vAlpha;
  varying float vAmber;
  varying float vTone;

  void main() {
    vec2 p = uRect.xy + aUv * uRect.zw + uShift;
    p += vec2(sin(uTime * 0.9 + aSeed.x * 40.0), cos(uTime * 0.8 + aSeed.y * 40.0)) * 0.6;

    vec2 d = p - uPointer;
    p += normalize(d + 1e-4) * smoothstep(110.0, 0.0, length(d)) * 16.0 * (1.0 - uProgress);

    float delay = aSeed.x * 0.55;
    float t = clamp((uProgress - delay) / 0.45, 0.0, 1.0);
    float e = t * t * (3.0 - 2.0 * t);
    float ang = (aSeed.y - 0.5) * 6.2831;
    vec2 dir = vec2(cos(ang), sin(ang)) * (0.35 + aSeed.z) + vec2(0.55, -0.9);
    p += dir * e * (180.0 + aSeed.w * 420.0);
    p += vec2(sin(uTime + aSeed.z * 30.0), cos(uTime * 0.7 + aSeed.w * 30.0)) * e * 22.0;

    vAlpha = aTone.x * 0.85 * (1.0 - smoothstep(0.35, 1.0, e));
    vAmber = aTone.y;
    vTone = aTone.x;

    gl_Position = vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, 0.0, 1.0);
    gl_PointSize = uSize * uDpr * (1.0 + e * 0.5);
  }
`;

const FRAG = `
  precision mediump float;
  uniform vec3 uInk;
  uniform vec3 uAmber;
  uniform float uLight;
  varying float vAlpha;
  varying float vAmber;
  varying float vTone;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.15, r) * vAlpha;
    if (a < 0.01) discard;
    vec3 col = mix(uInk * mix(0.55 + 0.45 * vTone, 1.0, uLight), uAmber, clamp(vAmber, 0.0, 1.0) * 0.9);
    gl_FragColor = vec4(col, a);
  }
`;

export default function PortraitParticles({ anchorRef, progressRef, photoRef, onFail }) {
  const canvasRef = useRef(null);
  const { motion } = useMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const anchor = anchorRef.current;
    if (!canvas || !anchor) return undefined;
    const host = canvas.parentElement;
    const photo = photoRef?.current;
    if (!motion) {
      canvas.style.display = 'none';
      if (photo) { photo.style.opacity = ''; photo.style.transform = ''; }
      return undefined;
    }
    canvas.style.display = '';

    let disposed = false;
    let raf = 0;
    let renderer, geo, mat, ro, io, onMove, onLeave;

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      onFail?.();
      return undefined;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    fetch('/portrait-points.bin')
      .then((r) => {
        if (!r.ok) throw new Error('missing');
        return r.arrayBuffer();
      })
      .then((buf) => {
        if (disposed) return;
        const dv = new DataView(buf);
        const n = dv.getUint32(0, true);
        const ar = dv.getFloat32(4, true);
        const us = new Uint16Array(buf, 8, n);
        const vs = new Uint16Array(buf, 8 + n * 2, n);
        const bs = new Uint8Array(buf, 8 + n * 4, n);
        const as = new Uint8Array(buf, 8 + n * 5, n);
        const uv = new Float32Array(n * 2);
        const seed = new Float32Array(n * 4);
        const tone = new Float32Array(n * 2);
        for (let i = 0; i < n; i++) {
          uv[i * 2] = us[i] / 65535;
          uv[i * 2 + 1] = vs[i] / 65535;
          seed.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
          tone[i * 2] = bs[i] / 255;
          tone[i * 2 + 1] = as[i] / 255;
        }
        geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
        geo.setAttribute('aUv', new THREE.BufferAttribute(uv, 2));
        geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
        geo.setAttribute('aTone', new THREE.BufferAttribute(tone, 2));
        mat = new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          uniforms: {
            uRes: { value: new THREE.Vector2(1, 1) },
            uRect: { value: new THREE.Vector4() },
            uProgress: { value: 0 },
            uTime: { value: 0 },
            uPointer: { value: new THREE.Vector2(-9999, -9999) },
            uShift: { value: new THREE.Vector2() },
            uSize: { value: 2 },
            uDpr: { value: dpr },
            uInk: { value: new THREE.Vector3(0.945, 0.929, 0.898) },
            uAmber: { value: new THREE.Vector3(0.91, 0.537, 0.29) },
            uLight: { value: 0 },
          },
        });
        const pts = new THREE.Points(geo, mat);
        pts.frustumCulled = false;
        scene.add(pts);

        const layout = () => {
          const hb = host.getBoundingClientRect();
          const ab = anchor.getBoundingClientRect();
          renderer.setSize(hb.width, hb.height, false);
          mat.uniforms.uRes.value.set(hb.width, hb.height);
          mat.uniforms.uRect.value.set(ab.left - hb.left, ab.top - hb.top, ab.width, ab.width * ar);
          mat.uniforms.uSize.value = Math.max(1.5, (ab.width / 190) * 1);
        };
        layout();
        ro = new ResizeObserver(layout);
        ro.observe(host);
        ro.observe(anchor);
        if (document.fonts) document.fonts.ready.then(() => { if (!disposed) layout(); });

        const target = { x: 0, y: 0 };
        const shift = { x: 0, y: 0 };
        onMove = (e) => {
          const hb = host.getBoundingClientRect();
          mat.uniforms.uPointer.value.set(e.clientX - hb.left, e.clientY - hb.top);
          target.x = (e.clientX / window.innerWidth - 0.5) * 2;
          target.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        onLeave = () => {
          mat.uniforms.uPointer.value.set(-9999, -9999);
          target.x = 0;
          target.y = 0;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('pointerleave', onLeave);

        let themeNow = '';
        const syncTheme = () => {
          const light = document.documentElement.dataset.theme === 'light';
          if ((light ? 'light' : 'dark') === themeNow) return;
          themeNow = light ? 'light' : 'dark';
          mat.uniforms.uInk.value.set(...(light ? [0.169, 0.153, 0.137] : [0.945, 0.929, 0.898]));
          mat.uniforms.uAmber.value.set(...(light ? [0.79, 0.435, 0.208] : [0.91, 0.537, 0.29]));
          mat.uniforms.uLight.value = light ? 1 : 0;
        };
        let intro = 1;
        let cur = 0;
        let t = 0;
        let last = performance.now();
        const introStart = last + 250;
        const loop = (now) => {
          raf = requestAnimationFrame(loop);
          t += Math.min(0.05, (now - last) / 1000);
          last = now;
          if (now > introStart && intro > 0) intro = Math.pow(1 - Math.min(1, (now - introStart) / 2400), 3);
          cur += ((progressRef.current || 0) - cur) * 0.12;
          shift.x += (target.x - shift.x) * 0.06;
          shift.y += (target.y - shift.y) * 0.06;
          syncTheme();
          const pr = Math.max(cur, intro);
          if (photo) {
            photo.style.opacity = String(0.9 + 0.1 * pr);
            photo.style.transform = `translate3d(${shift.x * -6}px, ${shift.y * -4}px, 0)`;
          }
          if (pr >= 0.999) {
            renderer.clear();
            return;
          }
          mat.uniforms.uProgress.value = pr;
          mat.uniforms.uTime.value = t;
          mat.uniforms.uShift.value.set(shift.x * 9, shift.y * 6);
          renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(loop);

        io = new IntersectionObserver(([en]) => {
          cancelAnimationFrame(raf);
          if (en.isIntersecting) {
            last = performance.now();
            raf = requestAnimationFrame(loop);
          }
        });
        io.observe(host);
      })
      .catch(() => {
        if (!disposed) onFail?.();
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      if (onMove) window.removeEventListener('pointermove', onMove);
      if (onLeave) document.removeEventListener('pointerleave', onLeave);
      if (photo) { photo.style.opacity = ''; photo.style.transform = ''; }
      if (geo) geo.dispose();
      if (mat) mat.dispose();
      renderer.dispose();
    };
  }, [motion, anchorRef, progressRef, photoRef, onFail]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 block h-full w-full" aria-hidden="true" />;
}
