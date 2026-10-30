import * as THREE from 'three';

const PALETTES = {
  dark: { ivory: new THREE.Color('#F1EDE5'), amber: new THREE.Color('#E8894A'), bg: '#050505' },
  light: { ivory: new THREE.Color('#2B2723'), amber: new THREE.Color('#C96F35'), bg: '#F6F3ED' },
};
let palette = PALETTES[typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'];
const tracked = new Set();
const listeners = new Set();

const dot = (size, opacity = 0.85) => new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, opacity, depthWrite: false, sizeAttenuation: true });

function paint(rec) {
  const { attr, amber, k, count } = rec;
  for (let i = 0; i < count; i++) {
    const col = amber[i] ? palette.amber : palette.ivory;
    attr.array[i * 3] = col.r * k[i];
    attr.array[i * 3 + 1] = col.g * k[i];
    attr.array[i * 3 + 2] = col.b * k[i];
  }
  attr.needsUpdate = true;
}

export function setSceneTheme(theme) {
  palette = PALETTES[theme === 'light' ? 'light' : 'dark'];
  tracked.forEach((ref) => {
    const rec = ref.deref();
    if (rec) paint(rec); else tracked.delete(ref);
  });
  listeners.forEach((fn) => fn());
}

function colorize(count, amberRatio, dim = 0.8) {
  const amber = new Uint8Array(count);
  const k = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    amber[i] = Math.random() < amberRatio ? 1 : 0;
    k[i] = dim * (0.55 + Math.random() * 0.45);
  }
  const attr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const rec = { attr, amber, k, count };
  paint(rec);
  tracked.add(new WeakRef(rec));
  return attr;
}

const smoother = (q) => q * q * q * (q * (q * 6 - 15) + 10);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const gauss = () => Math.sqrt(-2 * Math.log(Math.random() + 1e-9)) * Math.cos(Math.PI * 2 * Math.random());

export function createParticleMesh({ scene, camera, mobile }) {
  const n = mobile ? 2500 : 6000;
  const camZ = camera.position.z;
  const TUNNEL_NEAR = 6.2, TUNNEL_LEN = 80, FLOW = 5, GALAXY_R = 2.7;
  const per = mobile ? 28 : 40;
  const rings = Math.ceil(n / per);
  const spacing = TUNNEL_LEN / rings;

  const base = new Float32Array(n * 3);
  const src = new Float32Array(n * 3);
  const tgt = new Float32Array(n * 3);
  const shape = new Float32Array(n * 3);
  const pos = new Float32Array(n * 3);
  const rnd = new Float32Array(n * 3);
  const delay = new Float32Array(n);
  const tdelay = new Float32Array(n);
  const tAng = new Float32Array(n), tZ = new Float32Array(n), tJit = new Float32Array(n);
  const gR = new Float32Array(n), gA = new Float32Array(n), gH = new Float32Array(n), gCore = new Float32Array(n);
  const isAmber = new Uint8Array(n), kk = new Float32Array(n);
  const baseCol = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), t = i * 2.399963;
    base.set([Math.cos(t) * r * 2, y * 2, Math.sin(t) * r * 2], i * 3);
    rnd.set([Math.random(), Math.random(), Math.random()], i * 3);
    const ri = Math.floor(i / per), si = i % per;
    tAng[i] = (si / per) * Math.PI * 2 + ri * 0.37;
    tZ[i] = ri * spacing;
    tJit[i] = Math.random();
    const gr = GALAXY_R * Math.pow(Math.random(), 1.6) + 0.04;
    gR[i] = gr;
    gA[i] = (i % 3) * ((Math.PI * 2) / 3) + gr * 2.1 + gauss() * 0.32 * (0.25 + gr / GALAXY_R);
    gH[i] = gauss() * 0.2 * (1.25 - gr / GALAXY_R) * (gr < 0.5 ? 1.8 : 1);
    gCore[i] = 1 - smoother(clamp01((gr - 0.15) / 0.85));
    isAmber[i] = Math.random() < 0.14 ? 1 : 0;
    kk[i] = 0.8 * (0.55 + Math.random() * 0.45);
    tdelay[i] = Math.random() * 0.45;
  }

  const fillBase = () => {
    for (let i = 0; i < n; i++) {
      const c = isAmber[i] ? palette.amber : palette.ivory;
      baseCol[i * 3] = c.r * kk[i]; baseCol[i * 3 + 1] = c.g * kk[i]; baseCol[i * 3 + 2] = c.b * kk[i];
    }
  };
  fillBase();

  const colors = new THREE.BufferAttribute(new Float32Array(baseCol), 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', colors);
  const mat = dot(0.026);
  const pts = new THREE.Points(geo, mat);
  scene.fog = new THREE.Fog(palette.bg, camZ + 8.5, camZ + 36);
  scene.add(pts);

  let colorsDirty = true;
  const onTheme = () => { fillBase(); scene.fog.color.set(palette.bg); colorsDirty = true; };
  listeners.add(onTheme);

  let wob = 0.06;
  const fill = (mode, t, out) => {
    if (mode === 0) {
      for (let i = 0; i < n; i++) {
        const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
        const d = 1 + Math.sin(x * 2.2 + t * 0.6) * Math.cos(y * 2 + t * 0.5) * wob;
        out[i * 3] = x * d; out[i * 3 + 1] = y * d; out[i * 3 + 2] = z * d;
      }
    } else if (mode === 1) {
      for (let i = 0; i < n; i++) {
        const z = TUNNEL_NEAR - TUNNEL_LEN + ((tZ[i] + FLOW * t) % TUNNEL_LEN);
        const a = tAng[i] + z * 0.06 + t * 0.08;
        const R = 2.3 + 0.18 * Math.sin(z * 0.45 + t * 0.9 + tJit[i] * 6.283) + tJit[i] * 0.15;
        out[i * 3] = Math.cos(a) * R; out[i * 3 + 1] = Math.sin(a) * R; out[i * 3 + 2] = z;
      }
    } else {
      for (let i = 0; i < n; i++) {
        const r = gR[i];
        const th = gA[i] + (t * 0.5) / (0.45 + r * 0.9);
        out[i * 3] = r * Math.cos(th); out[i * 3 + 1] = gH[i]; out[i * 3 + 2] = r * Math.sin(th);
      }
    }
  };

  const hit = new THREE.Vector3();
  let s = 0, active = false, lastT = 0;
  let to = 0, u = 1;
  let w = [1, 0, 0], w0 = [1, 0, 0], wt = [1, 0, 0];

  return {
    setMode(k) {
      if (k === to || k < 0 || k > 2) return;
      src.set(shape);
      w0 = w.slice();
      wt = [0, 0, 0];
      wt[k] = 1;
      to = k;
      u = 0;
      for (let i = 0; i < n; i++) tdelay[i] = Math.random() * 0.45;
    },
    hit(progress) {
      return w[0] * 2.3 * (1 + progress * 0.5) + w[1] * 2.9 * (1 + progress * 0.12) + w[2] * 3 * (1 + progress * 0.2);
    },
    update(t, p, progress, ptr) {
      const dt = Math.min(0.05, Math.max(0, t - lastT));
      lastT = t;

      const want = ptr && ptr.inside;
      if (want && !active && s < 0.001) {
        const zf = Math.sqrt(Math.max(0, 4 - ptr.wx * ptr.wx - ptr.wy * ptr.wy));
        pts.updateMatrixWorld();
        hit.set(ptr.wx, ptr.wy, zf);
        pts.worldToLocal(hit);
        for (let i = 0; i < n; i++) {
          const dist = Math.min(1, Math.hypot(shape[i * 3] - hit.x, shape[i * 3 + 1] - hit.y, shape[i * 3 + 2] - hit.z) / 5);
          delay[i] = dist * 0.42 + rnd[i * 3] * 0.08;
        }
      }
      active = Boolean(want);
      s = clamp01(s + (active ? dt / 1.5 : -dt / 1.7));

      if (u < 1) {
        u = Math.min(1, u + dt / 2.6);
        const ws = smoother(u);
        w = [0, 1, 2].map((k) => w0[k] + (wt[k] - w0[k]) * ws);
      }
      wob = 0.06 + Math.hypot(p.x, p.y) * 0.1;

      if (u < 1) {
        fill(to, t, tgt);
        for (let i = 0; i < n; i++) {
          const i3 = i * 3;
          const e = smoother(clamp01((u - tdelay[i]) / 0.55));
          let x = src[i3] + (tgt[i3] - src[i3]) * e;
          let y = src[i3 + 1] + (tgt[i3 + 1] - src[i3 + 1]) * e;
          let z = src[i3 + 2] + (tgt[i3 + 2] - src[i3 + 2]) * e;
          const m = Math.sin(Math.PI * e);
          if (m > 0.001) {
            const len = Math.hypot(x, y, z) || 1;
            const push = m * (0.8 + rnd[i3 + 1] * 2.2);
            x += (x / len) * push; y += (y / len) * push; z += (z / len) * push;
            const a = m * (rnd[i3 + 2] - 0.5) * 3.2, ca = Math.cos(a), sa = Math.sin(a);
            const nx = x * ca + z * sa;
            z = -x * sa + z * ca;
            x = nx;
          }
          shape[i3] = x; shape[i3 + 1] = y; shape[i3 + 2] = z;
        }
      } else {
        fill(to, t, shape);
      }

      for (let i = 0; i < n; i++) {
        const i3 = i * 3;
        let px = shape[i3], py = shape[i3 + 1], pz = shape[i3 + 2];
        if (s > 0) {
          const e = smoother(clamp01((s - delay[i]) / 0.5));
          if (e > 0) {
            const len = Math.hypot(px, py, pz) || 1;
            const k = (1.3 + rnd[i3 + 1] * 2.6) * e;
            px += (px / len) * k;
            py += (py / len) * k + e * (rnd[i3 + 2] - 0.35) * 1.4;
            pz += (pz / len) * k;
            const a = e * (rnd[i3 + 2] - 0.5) * 2.4, ca = Math.cos(a), sa = Math.sin(a);
            const nx = px * ca + pz * sa;
            pz = -px * sa + pz * ca;
            px = nx;
            const drift = e * 0.12;
            px += Math.sin(t * 1.3 + i) * drift;
            py += Math.cos(t * 1.1 + i * 1.7) * drift;
          }
        }
        pos[i3] = px; pos[i3 + 1] = py; pos[i3 + 2] = pz;
      }
      geo.attributes.position.needsUpdate = true;

      if (w[0] < 0.999 || colorsDirty) {
        const ca = colors.array, am = palette.amber;
        const mt = w[1], mg = w[2];
        for (let i = 0; i < n; i++) {
          const i3 = i * 3;
          const nearFade = clamp01((TUNNEL_NEAR - shape[i3 + 2]) / 1.6);
          const f = 1 - mt * (1 - nearFade);
          const m = mg * gCore[i] * 0.9;
          ca[i3] = (baseCol[i3] + (am.r * kk[i] - baseCol[i3]) * m) * f;
          ca[i3 + 1] = (baseCol[i3 + 1] + (am.g * kk[i] - baseCol[i3 + 1]) * m) * f;
          ca[i3 + 2] = (baseCol[i3 + 2] + (am.b * kk[i] - baseCol[i3 + 2]) * m) * f;
        }
        colors.needsUpdate = true;
        colorsDirty = false;
      }

      pts.rotation.y = w[0] * (t * 0.08 + p.x * 0.7 + progress * 1.5) + w[1] * (p.x * 0.3) + w[2] * (progress * 0.8 + p.x * 0.5);
      pts.rotation.x = w[0] * (p.y * 0.4) + w[1] * (-p.y * 0.3) + w[2] * (1 + p.y * 0.35);
      pts.rotation.z = w[2] * 0.22;
      pts.scale.setScalar(w[0] * (1 + progress * 0.5) + w[1] * (1 + progress * 0.12) + w[2] * (1 + progress * 0.2));
      const op = w[0] * 0.85 * (1 - progress * 0.7) + w[1] * 0.9 * (1 - progress * 0.45) + w[2] * 0.9 * (1 - progress * 0.5);
      mat.opacity = op * (1 - 0.2 * s);
      mat.size = 0.026 * (1 + 0.45 * s);
    },
    dispose() {
      listeners.delete(onTheme);
      scene.fog = null;
      geo.dispose();
      mat.dispose();
    },
  };
}

export function createWaveField({ scene, camera, mobile }) {
  const cols = mobile ? 50 : 110, rows = mobile ? 30 : 60;
  const n = cols * rows, pos = new Float32Array(n * 3);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) pos.set([(i / (cols - 1) - 0.5) * 14, 0, (j / (rows - 1) - 0.5) * 8], (j * cols + i) * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', colorize(n, 0.3, 0.9));
  const mat = dot(0.04, 0.8);
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  camera.position.set(0, 3.2, 7);
  camera.lookAt(0, 0, 0);
  return {
    update(t, p, progress) {
      const amp = 0.35 + progress * 0.9, mx = p.x * 7, mz = p.y * -4;
      for (let k = 0, j = 0; j < rows; j++) for (let i = 0; i < cols; i++, k++) {
        const x = pos[k * 3], z = pos[k * 3 + 2];
        const near = Math.exp(-((x - mx) ** 2 + (z - mz) ** 2) / 2.5);
        pos[k * 3 + 1] = Math.sin(x * 0.7 + t * 0.8) * amp * 0.6 + Math.cos(z * 1.1 - t * 0.6 + progress * 4) * amp * 0.5 + near * 0.7 * Math.sin(t * 3);
      }
      geo.attributes.position.needsUpdate = true;
      pts.rotation.y = (progress - 0.5) * 0.5;
      pts.position.y = -progress * 0.8;
    },
    dispose() { geo.dispose(); mat.dispose(); },
  };
}

export function createParticleTorusKnot({ scene, mobile }) {
  const src = new THREE.TorusKnotGeometry(1.5, 0.45, mobile ? 260 : 520, mobile ? 14 : 24, 2, 3);
  const base = src.attributes.position.array.slice();
  const n = base.length / 3, pos = new Float32Array(base);
  src.dispose();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', colorize(n, 0.18));
  const mat = dot(0.022);
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return {
    update(t, p, progress) {
      const twist = progress * 0.5;
      for (let i = 0; i < n; i++) {
        const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
        const j = Math.sin(i * 12.9898) * 0.04 * (1 + Math.sin(t + i) * 0.5);
        const a = twist * y;
        pos[i * 3] = x * Math.cos(a) - z * Math.sin(a) + j;
        pos[i * 3 + 1] = y + j;
        pos[i * 3 + 2] = x * Math.sin(a) + z * Math.cos(a);
      }
      geo.attributes.position.needsUpdate = true;
      pts.rotation.set(progress * 3 + p.y * 0.5, t * 0.12 + p.x * 0.8, 0);
      pts.scale.setScalar(0.8 + progress * 0.4);
    },
    dispose() { geo.dispose(); mat.dispose(); },
  };
}
