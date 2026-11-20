/* ==========================================================================
   LIMBUS 启动器前端

   结构：
     1. WebGL 流体背景（raymarch 体积噪声，多场景参数插值）
     2. 故障层（Canvas 2D 乱码，过场时使用）
     3. 加载序列（自检日志 → 文字消散 → 镜头前推 → 冲进雾里）
     4. 路由与过场（黑客入侵感：撕裂、乱码、白闪）
   ========================================================================== */
(() => {
  'use strict';

  /* ==========================================================
     1. WebGL 流体
     ========================================================== */

  const glCanvas = document.getElementById('gl');
  const gl = glCanvas.getContext('webgl', {
    antialias: false, alpha: false, depth: false,
    powerPreference: 'high-performance',
  });

  const VERT = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;

    uniform vec2  uRes;
    uniform float uTime;
    uniform vec2  uMouse;
    uniform float uBreath;
    uniform float uDensity;
    uniform float uGain;
    uniform float uSpeed;
    uniform float uZoom;
    uniform float uHue;
    uniform float uGlitch;
    uniform float uRot;
    uniform vec2  uShift;
    uniform float uWarp;
    uniform vec2  uSquash;
    uniform float uBright;
    uniform int uSteps;

    // 画面模式：0 体积雾 / 1 线框网格 / 2 星场 / 3 光带。
    // 用连续值插值时两种画面会真的彼此溶解，而不是同一团雾换浓度。
    uniform float uMode;

    /* ---------------- gradient noise ---------------- */
    vec3 hash33(vec3 p) {
      p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
               dot(p, vec3(269.5, 183.3, 246.1)),
               dot(p, vec3(113.5, 271.9, 124.6)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    float gnoise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      // quintic：比 smoothstep 少一阶导数跳变，块状感明显更弱
      vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      float n000 = dot(hash33(i + vec3(0.0,0.0,0.0)), f - vec3(0.0,0.0,0.0));
      float n100 = dot(hash33(i + vec3(1.0,0.0,0.0)), f - vec3(1.0,0.0,0.0));
      float n010 = dot(hash33(i + vec3(0.0,1.0,0.0)), f - vec3(0.0,1.0,0.0));
      float n110 = dot(hash33(i + vec3(1.0,1.0,0.0)), f - vec3(1.0,1.0,0.0));
      float n001 = dot(hash33(i + vec3(0.0,0.0,1.0)), f - vec3(0.0,0.0,1.0));
      float n101 = dot(hash33(i + vec3(1.0,0.0,1.0)), f - vec3(1.0,0.0,1.0));
      float n011 = dot(hash33(i + vec3(0.0,1.0,1.0)), f - vec3(0.0,1.0,1.0));
      float n111 = dot(hash33(i + vec3(1.0,1.0,1.0)), f - vec3(1.0,1.0,1.0));
      float x00 = mix(n000, n100, u.x);
      float x10 = mix(n010, n110, u.x);
      float x01 = mix(n001, n101, u.x);
      float x11 = mix(n011, n111, u.x);
      return mix(mix(x00, x10, u.y), mix(x01, x11, u.y), u.z);
    }

    float fbm(vec3 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 3; i++) {
        v += a * gnoise(p);
        p = p * 2.03 + vec3(11.3, 7.7, 3.1);
        a *= 0.5;
      }
      return v;
    }

    /* ---------------- 模式 0：体积雾 ---------------- */
    float fogDensity(vec3 p) {
      p.z += uTime * uSpeed;
      p.y += uTime * uSpeed * 0.26;
      p.x += uMouse.x * 0.45 * smoothstep(-1.0, 2.0, p.z + 2.0);
      p.y += uMouse.y * 0.35 * smoothstep(-1.0, 2.0, p.z + 2.0);

      float w1 = gnoise(p * 0.42);
      float w2 = gnoise(p * 0.42 + vec3(17.3, 9.1, 4.7));
      float warp = mix(0.9, 1.7, uBreath) + uWarp;
      vec3 q = p + vec3(w1, w2, w1 * w2) * warp;

      float d = fbm(q * 1.05) + gnoise(q * 5.2 + vec3(uTime * 0.22, 0.0, 0.0)) * 0.16;
      return smoothstep(uDensity, uDensity + 0.13, d * 0.5 + 0.5);
    }

    vec3 fogColor(vec3 p, float den) {
      float t = clamp(p.y * 0.35 + p.z * 0.12 + 0.5, 0.0, 1.0);
      vec3 deep = vec3(0.004, 0.014, 0.032);
      vec3 mid  = vec3(0.02, 0.66, 1.02);
      vec3 high = vec3(0.52, 0.18, 1.06);
      mid  = mix(mid, high, clamp(uHue, 0.0, 1.0));
      high = mix(high, mid, clamp(-uHue, 0.0, 1.0));
      vec3 c = mix(deep, mid, smoothstep(0.0, 0.65, t));
      c = mix(c, high, smoothstep(0.62, 1.0, t) * 0.55);
      return c * (0.25 + 1.6 * den);
    }

    vec3 renderFog(vec2 uv) {
      float sway = sin(uTime * 0.07) * 0.55;
      vec3 ro = vec3(sway, cos(uTime * 0.05) * 0.22, uZoom);
      vec3 rd = normalize(vec3(uv, 1.25));
      vec3 col = vec3(0.0);
      float trans = 1.0, dist = 0.0;

      for (int i = 0; i < 24; i++) {
        if (i >= uSteps) break;
        vec3 p = ro + rd * dist;
        float den = fogDensity(p);
        if (den > 0.001) {
          vec3 c = fogColor(p, den);
          float glow = exp(-dist * 0.11);
          float dens = pow(den, 2.2);
          col += c * dens * trans * glow * 0.95;
          trans *= 1.0 - den * 0.20;
        }
        dist += 0.22;
        if (trans < 0.02) break;
      }
      return col;
    }

    /* ---------------- 模式 1：线框网格 ---------------- */
    vec3 renderGrid(vec2 uv) {
      float horizon = 0.56;
      float y = uv.y + horizon;
      if (y <= 0.0) return vec3(0.0);

      float depth = 1.0 / y;
      vec2 gp = vec2(uv.x * depth, depth + uTime * uSpeed * 2.0);

      // 线宽：阈值放宽，线条才看得见
      // 频率提高、线宽收窄：细线才是科技网格，粗格子像地砖
      vec2 g = abs(fract(gp * 1.1) - 0.5);
      float grid = smoothstep(0.40, 0.5, min(g.x, g.y));

      float pulse = 0.5 + 0.5 * sin(gp.y * 1.2 - uTime * 2.2);
      grid *= 0.45 + 0.55 * pulse;

      // 衰减别太陡，否则远处全黑
      float fade = exp(-depth * 0.045);
      vec3 c = mix(vec3(0.04, 0.42, 0.68), vec3(0.16, 0.92, 1.0), pulse);
      vec3 col = c * grid * fade * uGain * 5.0;

      // 网格之间的暗面，给一点底子，避免整体死黑
      col += vec3(0.006, 0.026, 0.048) * fade * 1.6;

      float hz = smoothstep(0.03, 0.0, abs(y));
      col += vec3(0.10, 0.62, 0.92) * hz * 0.8;
      return col;
    }

    /* ---------------- 模式 2：星场 ---------------- */
    float hash21(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    vec3 renderStar(vec2 uv) {
      vec3 col = vec3(0.0);
      for (int layer = 0; layer < 3; layer++) {
        float fl = float(layer);
        float scale = 26.0 + fl * 26.0;
        vec2 p = uv * scale + vec2(uTime * (0.02 + fl * 0.015), 0.0);
        vec2 cell = floor(p);
        vec2 sub = fract(p) - 0.5;
        float h = hash21(cell + fl * 31.7);
        if (h > 0.86) {
          float d = length(sub);
          float star = smoothstep(0.03 + h * 0.05, 0.0, d);
          float tw = 0.5 + 0.5 * sin(uTime * (1.2 + h * 2.0) + h * 40.0);
          vec3 c = mix(vec3(0.5, 0.8, 1.0), vec3(0.85, 0.92, 1.0), h);
          col += c * star * tw * (0.5 - fl * 0.12) * uGain * 3.0;
        }
      }
      float haze = smoothstep(1.2, 0.0, length(uv));
      col += vec3(0.01, 0.05, 0.10) * haze;
      return col;
    }

    /* ---------------- 模式 3：光带 ---------------- */
    vec3 renderBand(vec2 uv) {
      float center = sin(uv.x * 1.4 + uTime * 0.35) * 0.05
                   + sin(uv.x * 0.7 - uTime * 0.2) * 0.03;
      float d = abs(uv.y - center);

      float core = smoothstep(0.0022, 0.0, d);
      float glow = exp(-d * 30.0) * 0.16 + exp(-d * 6.0) * 0.05;

      vec3 c = mix(vec3(0.08, 0.58, 0.88), vec3(0.42, 0.78, 1.0), 0.5);
      vec3 col = c * (core * 0.55 + glow) * uGain * 1.1;

      // 沿线流动的亮点，压低到只是微光
      float pulse = pow(0.5 + 0.5 * sin(uv.x * 3.0 - uTime * 1.1), 16.0);
      col += vec3(0.6, 0.9, 1.0) * pulse * smoothstep(0.05, 0.0, d) * 0.22;
      return col;
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
      uv /= uSquash;

      float cr = cos(uRot), sr = sin(uRot);
      uv = mat2(cr, -sr, sr, cr) * uv;
      uv += uShift * 0.18;

      float m = clamp(uMode, 0.0, 3.0);
      vec3 col;
      if (m < 1.0) {
        col = mix(renderFog(uv), renderGrid(uv), smoothstep(0.0, 1.0, m));
      } else if (m < 2.0) {
        col = mix(renderGrid(uv), renderStar(uv), smoothstep(1.0, 2.0, m));
      } else {
        col = mix(renderStar(uv), renderBand(uv), smoothstep(2.0, 3.0, m));
      }

      col *= mix(0.72, 1.18, uBreath);

      vec2 v = gl_FragCoord.xy / uRes;
      float vig = 16.0 * v.x * v.y * (1.0 - v.x) * (1.0 - v.y);
      col *= pow(clamp(vig, 0.0, 1.0), 0.42);

      col = col / (col + 1.15);
      col = pow(col, vec3(0.86));

      col += vec3(0.10, 0.02, 0.06) * uGlitch;
      col *= uBright;

      gl_FragColor = vec4(col, 1.0);
    }
  `;


  let prog = null, u = {};

  function initGL() {
    if (!gl) return false;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;

    prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return false;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    ['uRes', 'uTime', 'uMouse', 'uBreath', 'uDensity', 'uGain', 'uSpeed', 'uZoom', 'uHue', 'uGlitch', 'uRot', 'uShift', 'uWarp', 'uSquash', 'uBright', 'uSteps', 'uMode'].forEach((n) => {
      u[n] = gl.getUniformLocation(prog, n);
    });

    return true;
  }

  /* ==========================================================
     2. 场景参数
     ========================================================== */

  // 每个页面一套背景参数，切换时向目标插值
  // 每个场景一套完整镜头参数。转场不是盖遮罩，是让相机真的走到这个位置，
  // 所以每页的"进入方式"天然不同：
  //   start  向前冲进雾里        zoom 拉近、密度升高
  //   mods   横向滑移 + 轻微转身  shift 右移、rot 转一点
  //   arena  绕到侧面并拉远      rot 转更多、zoom 退
  //   conf   向后退开            zoom 大幅后退、密度变稀
  const SCENES = {
    // mode 决定画面形态，不是同一团雾换参数：
    //   0 体积雾   1 线框网格   2 星场   3 光带
    boot:  { mode: 0, density: 0.50, gain: 0.60, speed: 0.150, zoom: -2.40, hue: 0.00, rot: 0.00, shiftX: 0.0, shiftY: 0.0 },
    menu:  { mode: 0, density: 0.62, gain: 0.28, speed: 0.070, zoom: -2.15, hue: 0.00, rot: 0.00, shiftX: 0.0, shiftY: 0.0 },
    start: { mode: 0, density: 0.46, gain: 0.50, speed: 0.095, zoom: -0.90, hue: 0.00, rot: 0.10, shiftX: 0.0, shiftY: 0.1 },
    mods:  { mode: 1, density: 0.58, gain: 0.75, speed: 0.150, zoom: -2.20, hue: -0.30, rot: 0.00, shiftX: 0.0, shiftY: 0.0 },
    arena: { mode: 2, density: 0.70, gain: 1.10, speed: 0.040, zoom: -3.30, hue: 0.35, rot: 0.00, shiftX: 0.0, shiftY: 0.0 },
    conf:  { mode: 3, density: 0.82, gain: 1.00, speed: 0.030, zoom: -2.60, hue: 0.05, rot: 0.00, shiftX: 0.0, shiftY: 0.0 },
  };

  // 转场冲击：切换瞬间把这几项推到峰值，再衰减回 0。
  // 每页组合完全不同，所以看到的是四种不同的流体形变，
  // 不是同一段动画换个参数跑四遍。
  const IMPACT = {
    // 前冲：极度卷曲 + 纵向拉伸 + 提亮，像一头扎进浓雾
    start: { warp: 2.6, speed: 4.2, squashX: 0.62, squashY: 1.55, bright: 1.55, dur: 950 },
    // 擦过：横向拉宽 + 快速流动 + 轻微变亮，像被侧向气流带走
    mods:  { warp: 1.9, speed: 2.6, squashX: 1.95, squashY: 0.72, bright: 1.18, dur: 820 },
    // 退出：反向扭曲 + 压暗 + 几乎静止，像退到很远的地方看
    arena: { warp: -1.4, speed: 0.25, squashX: 1.0, squashY: 0.86, bright: 0.55, dur: 1150 },
    // 合拢：纵向压缩 + 强压暗，像幕布落下
    conf:  { warp: 0.9, speed: 0.35, squashX: 0.9, squashY: 0.58, bright: 0.42, dur: 1050 },
    // 回归：反向卷曲 + 提亮，像从里面被推出来
    menu:  { warp: -1.9, speed: 2.0, squashX: 1.1, squashY: 1.15, bright: 1.25, dur: 900 },
  };

  // 当前冲击值与剩余时间
  const imp = { warp: 0, speed: 1, sx: 1, sy: 1, bright: 1, t: 0, dur: 0 };
  const impTarget = { warp: 0, speed: 1, sx: 1, sy: 1, bright: 1 };

  function fireImpact(pageId) {
    const k = IMPACT[pageId] || IMPACT.menu;
    imp.warp = k.warp;
    imp.speed = k.speed;
    imp.sx = k.squashX;
    imp.sy = k.squashY;
    imp.bright = k.bright;
    imp.t = 0;
    imp.dur = k.dur;
  }
  const cur = { ...SCENES.boot };   // 当前值
  const tgt = { ...SCENES.boot };   // 目标值

  const st = {
    mouse: { x: 0, y: 0 },
    mouseT: { x: 0, y: 0 },
    glitch: 0,
    glitchTarget: 0,
    t: 0,
  };

  window.addEventListener('mousemove', (e) => {
    st.mouseT.x = (e.clientX / window.innerWidth) * 2 - 1;
    st.mouseT.y = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.0);
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    if (glCanvas.width !== w || glCanvas.height !== h) {
      glCanvas.width = w;
      glCanvas.height = h;
      if (gl) gl.viewport(0, 0, w, h);
    }
    const gc = document.getElementById('glitch');
    if (gc) { gc.width = w; gc.height = h; }
  }
  window.addEventListener('resize', resize);

  /* ==========================================================
     3. 故障层：乱码
     ========================================================== */

  const gCanvas = document.getElementById('glitch');
  const gCtx = gCanvas.getContext('2d');

  const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF!<>[]{}/\\|=+-*_';

  let glitchDirty = false;      // 上一次是否画过东西

  function drawGlitch(amount) {
    if (!gCtx) return;

    // 静止时不要碰 canvas：clearRect 是全屏像素操作，每帧都做纯属浪费
    if (amount <= 0.01) {
      if (glitchDirty) {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
        gCanvas.style.opacity = '0';
        glitchDirty = false;
      }
      return;
    }

    glitchDirty = true;
    const w = gCanvas.width, h = gCanvas.height;
    gCtx.clearRect(0, 0, w, h);

    gCanvas.style.opacity = String(Math.min(1, amount * 0.85));

    // 横向撕裂条：随机几条，整体位移
    const bands = Math.floor(amount * 14);
    for (let i = 0; i < bands; i++) {
      const y = Math.random() * h;
      const bh = 2 + Math.random() * 14;
      gCtx.fillStyle = `rgba(${60 + Math.random() * 60}, ${200 + Math.random() * 55}, 255, ${0.05 + Math.random() * 0.12})`;
      gCtx.fillRect(Math.random() * w * 0.3, y, w * (0.3 + Math.random() * 0.7), bh);
    }

    // 字符块：密度随故障强度增加
    const count = Math.floor(amount * 380);
    gCtx.font = '13px Consolas, monospace';
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      const a = 0.12 + Math.random() * 0.55;
      gCtx.fillStyle = Math.random() > 0.82
        ? `rgba(255,120,160,${a})`
        : `rgba(120,235,255,${a})`;
      gCtx.fillText(ch, x, y);
    }

    // 水平细线噪点
    const lines = Math.floor(amount * 40);
    for (let i = 0; i < lines; i++) {
      const y = Math.random() * h;
      gCtx.fillStyle = `rgba(160,240,255,${0.03 + Math.random() * 0.12})`;
      gCtx.fillRect(0, y, w, 1);
    }
  }

  /* ==========================================================
     4. 加载序列
     ========================================================== */

  const BOOT_LINES = [
    'KERNEL HANDSHAKE',
    'MEMORY MATRIX 64T / 64T',
    'QUANTUM LINK  QLINK-7',
    'SECTOR MAP    4096 LOCKED',
    'NEURAL IF     v4.2 ONLINE',
    'GRAVITY SENSOR  0.003 DEV',
    'THERMAL SHIELD  100%',
    'CIPHER        AES-4096',
    'STAR CHART    128 SYSTEMS',
    'TACTICAL CORE READY',
    'WEAPON BUS    ALL ONLINE',
    'RENDER ENGINE 60 FPS LOCK',
    'OPERATOR AUTH COMMANDER',
    'INITIALIZING INTERFACE',
  ];

  const bootEl = document.getElementById('boot');
  const bootLog = document.getElementById('bootlog');
  const bootBar = document.getElementById('bootbar');
  const bootPct = document.getElementById('bootpct');

  function runBoot() {
    let i = 0;

    const step = () => {
      if (i >= BOOT_LINES.length) {
        setTimeout(() => finishBoot(), 420);
        return;
      }

      const div = document.createElement('div');
      div.className = 'ln';
      div.innerHTML = `<b>[ OK ]</b> ${BOOT_LINES[i]}`;
      bootLog.appendChild(div);

      const pct = Math.round((i + 1) / BOOT_LINES.length * 100);
      bootBar.style.width = pct + '%';
      bootPct.textContent = pct + '%';

      i++;
      setTimeout(step, 88);
    };

    step();
  }

  /* 加载完成后：文字消散 → 镜头前推 → 撕裂 → 冲进雾里 → 主界面 */
  function finishBoot() {
    const app = document.getElementById('app');

    // 1) 文字从后往前逐字消失
    const lines = bootLog.querySelectorAll('.ln');
    lines.forEach((ln, idx) => {
      setTimeout(() => {
        ln.style.transition = 'opacity .35s ease, transform .35s ease, filter .35s ease';
        ln.style.opacity = '0';
        ln.style.transform = 'translateX(-14px)';
        ln.style.filter = 'blur(3px)';
      }, idx * 22);
    });

    // 2) 自检区其余部分同时淡出
    const gone = 300;
    setTimeout(() => {
      bootEl.classList.add('out');
    }, gone);

    // 3) 镜头前推 + 故障拉满
    setTimeout(() => {
      tgt.zoom = 0.6;
      tgt.gain = 1.05;
      tgt.density = 0.40;
      st.glitchTarget = 1;
    }, gone + 240);

    // 4) 白闪
    setTimeout(() => {
      const f = document.getElementById('flash');
      f.style.transition = 'opacity .09s linear';
      f.style.opacity = '0.85';
    }, gone + 760);

    // 5) 收起故障、换场景、露出界面
    setTimeout(() => {
      const f = document.getElementById('flash');
      f.style.transition = 'opacity .55s ease';
      f.style.opacity = '0';

      st.glitchTarget = 0;
      Object.assign(tgt, SCENES.menu);

      bootEl.style.display = 'none';
      app.classList.remove('hidden');
    }, gone + 900);
  }

  /* ==========================================================
     5. 路由与过场

     两屏结构：
       主菜单(#menu)  与  子页面(.sub)  是平级的整屏，
       同一时刻只露一个，切换必须经过场。
     ========================================================== */

  const menuEl  = document.getElementById('menu');
  const subEls  = [...document.querySelectorAll('.sub')];
  const goBtns  = [...document.querySelectorAll('.m-i')];
  const backBtns = [...document.querySelectorAll('[data-back]')];

  let current = 'menu';      // 'menu' 或某个子页面 id
  let busy = false;

  function showOnly(el) {
    if (menuEl) menuEl.classList.toggle('is-on', el === menuEl);
    subEls.forEach((s) => s.classList.toggle('is-on', s === el));
  }

  /** 转场：让相机真的走过去，而不是盖一层动画再揭掉 */
  function cut(toEl, newScene, nextId) {
    if (busy) return;
    busy = true;

    // 当前可见的屏先自己退场，不遮挡
    const fromEl = menuEl.classList.contains('is-on')
      ? menuEl
      : subEls.find((s) => s.classList.contains('is-on'));

    if (fromEl) {
      fromEl.classList.remove('enter');
      fromEl.classList.add('leaving');
    }

    // 背景立刻开始走向新场景，同时按目标页面施加形变冲击
    Object.assign(tgt, SCENES[newScene] || SCENES.menu);
    fireImpact(newScene);

    // 内容在镜头动起来之后换，视觉上是"穿过一段空间后看到的"
    setTimeout(() => {
      if (fromEl) fromEl.classList.remove('leaving');
      showOnly(toEl);
      toEl.classList.remove('enter');
      void toEl.offsetWidth;
      toEl.classList.add('enter');
      current = nextId;
    }, 300);

    setTimeout(() => { busy = false; }, 980);
  }

  /** 进入子页面 */
  function goTo(pageId) {
    const el = subEls.find((s) => s.dataset.page === pageId);
    if (!el) return;
    cut(el, pageId, pageId);
  }

  /** 退回主菜单 */
  function goBack() {
    cut(menuEl, 'menu', 'menu');
  }

  goBtns.forEach((b) => {
    b.addEventListener('click', (e) => {
      if (e.detail === 0) return;         // 忽略键盘/合成事件
      goTo(b.dataset.go);
    });
  });

  backBtns.forEach((b) => {
    b.addEventListener('click', (e) => {
      if (e.detail === 0) return;
      goBack();
    });
  });

  // Esc 也退回主菜单
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current !== 'menu') goBack();
  });

  /** 直接落到某一屏，用于调试和截图 */
  function lockTo(target) {
    if (target === 'menu' || !target) {
      showOnly(menuEl);
      Object.assign(tgt, SCENES.menu);
      Object.assign(cur, SCENES.menu);
      current = 'menu';
      return;
    }
    const el = subEls.find((s) => s.dataset.page === target);
    if (!el) { lockTo('menu'); return; }
    showOnly(el);
    el.classList.add('enter');
    Object.assign(tgt, SCENES[target] || SCENES.menu);
    Object.assign(cur, SCENES[target] || SCENES.menu);
    current = target;

    // 调试：hash 里带 "&impact" 时把形变冻结在峰值，用来截图核对
    if (rawHash.indexOf('impact') >= 0) {
      fireImpact(target);
      imp.dur = 1e9;
      imp.t = 0;
      Object.assign(cur, SCENES[target] || SCENES.menu);
    }
  }

  const rawHash = (location.hash || '').replace('#', '');
  lockTo((rawHash.split('&')[0]) || 'menu');
/* ==========================================================
     6. 时钟与杂项
     ========================================================== */

  function tickClock() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    const el = document.getElementById('clock');
    if (el) el.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  /* ==========================================================
     7. 主循环
     ========================================================== */

  // 自适应画质：帧率撑不住就降步数、降分辨率
  const perf = { steps: 24, dpr: 0.85, fps: 60, acc: 0, n: 0, cool: 0 };

  let lastNow = 0;

  function loop(now) {
    requestAnimationFrame(loop);
    if (document.hidden) return;

    const dt = lastNow ? Math.min((now - lastNow) / 1000, 0.05) : 0.016;
    lastNow = now;
    st.t += dt;

    // 静态页（主菜单 / 开始页）且没有故障效果时，这一帧什么都不用做。
    // 省掉插值、呼吸计算和 glitch 清理。
    const inMenu0 = menuEl && menuEl.classList.contains('is-on');
    const isStatic0 = inMenu0 || current === 'start' || current === 'conf' || current === 'arena' || current === 'mods';
    if (isStatic0 && st.glitch < 0.006 && st.glitchTarget < 0.006) return;

    // 鼠标平滑
    st.mouse.x += (st.mouseT.x - st.mouse.x) * 0.05;
    st.mouse.y += (st.mouseT.y - st.mouse.y) * 0.05;

    // 场景参数向目标插值，速率随差值自适应
    const k = 1 - Math.pow(0.0016, dt);
    for (const key in tgt) {
      cur[key] += (tgt[key] - cur[key]) * k;
    }

    // 故障强度平滑
    st.glitch += (st.glitchTarget - st.glitch) * (1 - Math.pow(0.0008, dt));
    drawGlitch(st.glitch);

    // 呼吸：两条不同周期的正弦叠加
    const breath =
      0.5 + 0.5 * Math.sin(st.t * 0.55) * 0.72 +
      0.5 * 0.5 * Math.sin(st.t * 0.21 + 1.3);

    const inMenu = menuEl && menuEl.classList.contains('is-on');
    // 开始页也用静态图，只有剩下的子页面才需要跑 WebGL
    const isStatic = inMenu || current === 'start' || current === 'conf' || current === 'arena' || current === 'mods';
    if (prog && !isStatic) {
      // 冲击衰减：t 走完 dur 就归零，期间用 easeOut 曲线回落，
      // 峰值只出现在切换那一下，之后流体自己慢慢恢复平静
      let iw = 0, isp = 1, isx = 1, isy = 1, ibr = 1;
      if (imp.t < imp.dur) {
        imp.t += dt * 1000;
        const p = Math.min(imp.t / imp.dur, 1);
        const e = 1 - Math.pow(1 - p, 3);      // easeOutCubic
        const fall = 1 - e;
        iw  = imp.warp * fall;
        isp = 1 + (imp.speed - 1) * fall;
        isx = 1 + (imp.sx - 1) * fall;
        isy = 1 + (imp.sy - 1) * fall;
        ibr = 1 + (imp.bright - 1) * fall;
      }

      gl.uniform2f(u.uRes, glCanvas.width, glCanvas.height);
      gl.uniform1f(u.uTime, st.t);
      gl.uniform2f(u.uMouse, st.mouse.x, st.mouse.y);
      gl.uniform1f(u.uBreath, breath);
      gl.uniform1f(u.uMode, cur.mode === undefined ? 0 : cur.mode);
      gl.uniform1f(u.uDensity, cur.density);
      gl.uniform1f(u.uGain, cur.gain);
      gl.uniform1f(u.uSpeed, cur.speed * isp);
      gl.uniform1f(u.uZoom, cur.zoom);
      gl.uniform1f(u.uHue, cur.hue);
      gl.uniform1f(u.uGlitch, st.glitch);
      gl.uniform1f(u.uRot, cur.rot || 0);
      gl.uniform2f(u.uShift, cur.shiftX || 0, cur.shiftY || 0);

      gl.uniform1f(u.uWarp, iw);
      gl.uniform2f(u.uSquash, isx, isy);
      gl.uniform1f(u.uBright, ibr);
      gl.uniform1i(u.uSteps, perf.steps);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  /* ==========================================================
     启动
     ========================================================== */

  if (!initGL()) {
    document.body.style.background = '#03060a';
  }



  resize();
  tickClock();
  setInterval(tickClock, 1000);

  // 窗口按钮改由 data.js 发 JSON 命令





  requestAnimationFrame(loop);

  // 调试：#noboot 直接跳过加载，立刻进入目标屏并播放 3D 进入动画，
  // 用来在转场中途截图核对运动方式。
  if (rawHash.indexOf('noboot') >= 0) {
    const app = document.getElementById('app');
    if (bootEl) bootEl.style.display = 'none';
    app.classList.remove('hidden');
    const curEl = subEls.find((s) => s.classList.contains('is-on')) || menuEl;
    curEl.classList.remove('enter');
    void curEl.offsetWidth;
    curEl.classList.add('enter');
  } else {
    runBoot();
  }
})();
