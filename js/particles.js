// Particle Generation Module - OPTIMIZED VERSION

let planetSurface,
  blueCore,
  mainRing,
  ring2,
  ring3,
  starField,
  tinyStars,
  nebula;
let sharpTexture;

function initParticles() {
  sharpTexture = getSharpTexture();

  createPlanetSurface();
  createBlueCore();
  createRings();
  createStars();
  createNebula();
}

// Create Planet Surface Particles
function createPlanetSurface() {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(CONFIG.SURFACE_PARTICLE_COUNT * 3);
  const cols = new Float32Array(CONFIG.SURFACE_PARTICLE_COUNT * 3);

  const color1 = new THREE.Color(CONFIG.PLANET_COLOR1);
  const color2 = new THREE.Color(CONFIG.PLANET_COLOR2);
  const tempColor = new THREE.Color(); // Reuse this object

  for (let i = 0; i < CONFIG.SURFACE_PARTICLE_COUNT; i++) {
    const r = CONFIG.PLANET_RADIUS + Math.random() * CONFIG.PLANET_DEPTH;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;

    const mix = Math.random();
    // Optimization: Reuse tempColor, avoid creating new objects
    tempColor.copy(color1).lerp(color2, mix);

    cols[i * 3] = tempColor.r;
    cols[i * 3 + 1] = tempColor.g;
    cols[i * 3 + 2] = tempColor.b;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));

  const mat = new THREE.PointsMaterial({
    size: CONFIG.SURFACE_PARTICLE_SIZE,
    vertexColors: true,
    map: sharpTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.8,
  });

  planetSurface = new THREE.Points(geo, mat);
  getCentralSystem().add(planetSurface);
}

// Create Pulsing Blue Core
function createBlueCore() {
  const coreMaterial = new THREE.SpriteMaterial({
    map: getBlueGlow(),
    color: CONFIG.CORE_COLOR,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 1.0,
  });

  blueCore = new THREE.Sprite(coreMaterial);
  blueCore.scale.set(3, 3, 3);
  getCentralSystem().add(blueCore);
}

// Helper function to create a ring
function createRing(innerR, outerR, count, colorHex1, colorHex2, size = 0.05) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);

  const c1 = new THREE.Color(colorHex1);
  const c2 = new THREE.Color(colorHex2);
  const tempColor = new THREE.Color(); // Reuse this object

  for (let i = 0; i < count; i++) {
    const r = innerR + Math.random() * (outerR - innerR);
    const theta = Math.random() * Math.PI * 2;

    pos[i * 3] = r * Math.cos(theta);
    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
    pos[i * 3 + 2] = r * Math.sin(theta);

    const t = (r - innerR) / (outerR - innerR);

    // Optimization: Lerp without cloning
    tempColor.copy(c1).lerp(c2, t);

    col[i * 3] = tempColor.r;
    col[i * 3 + 1] = tempColor.g;
    col[i * 3 + 2] = tempColor.b;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));

  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: size,
      vertexColors: true,
      map: sharpTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.7,
    })
  );
}

// Create All Rings
function createRings() {
  // Main Golden Ring
  mainRing = createRing(
    CONFIG.MAIN_RING_INNER,
    CONFIG.MAIN_RING_OUTER,
    CONFIG.MAIN_RING_PARTICLES,
    CONFIG.MAIN_RING_COLOR1,
    CONFIG.MAIN_RING_COLOR2,
    0.06
  );
  getCentralSystem().add(mainRing);

  // Ring 2 - Random vibrant color
  const randomColor1 = new THREE.Color().setHSL(Math.random(), 1.0, 0.6);
  const randomColor1End = randomColor1.clone().offsetHSL(0, 0, -0.2);

  ring2 = createRing(
    CONFIG.RING2_INNER,
    CONFIG.RING2_OUTER,
    CONFIG.RING2_PARTICLES,
    randomColor1.getHex(),
    randomColor1End.getHex(),
    0.05
  );
  getCentralSystem().add(ring2);

  // Ring 3 - Another random vibrant color
  const randomColor2 = new THREE.Color().setHSL(Math.random(), 1.0, 0.6);
  const randomColor2End = randomColor2.clone().offsetHSL(0, 0, -0.2);

  ring3 = createRing(
    CONFIG.RING3_INNER,
    CONFIG.RING3_OUTER,
    CONFIG.RING3_PARTICLES,
    randomColor2.getHex(),
    randomColor2End.getHex(),
    0.05
  );
  getCentralSystem().add(ring3);
}

// Create Realistic Stars
function createStars() {
  const starsGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(CONFIG.STAR_COUNT * 3);
  const starColors = new Float32Array(CONFIG.STAR_COUNT * 3);
  const tempColor = new THREE.Color(); // Reuse object

  for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 10 + Math.pow(Math.random(), 2) * 100;

    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);

    const colorType = Math.random();

    // Optimization: Set color on the reusable object
    if (colorType > 0.9) tempColor.setHex(0xffdddd); // Reddish
    else if (colorType > 0.7) tempColor.setHex(0xddeeff); // Bluish
    else tempColor.setHex(0xffffff); // White

    const distFactor = 1 - Math.min(r / 100, 0.8);
    tempColor.multiplyScalar(distFactor);

    starColors[i * 3] = tempColor.r;
    starColors[i * 3 + 1] = tempColor.g;
    starColors[i * 3 + 2] = tempColor.b;
  }

  starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  starsGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    map: sharpTexture,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  starField = new THREE.Points(starsGeo, starMat);
  getUniverseGroup().add(starField);

  // Tiny background stars
  const tinyStarsGeo = new THREE.BufferGeometry();
  const tinyPos = new Float32Array(CONFIG.TINY_STAR_COUNT * 3);
  for (let i = 0; i < CONFIG.TINY_STAR_COUNT * 3; i++)
    tinyPos[i] = (Math.random() - 0.5) * 300;
  tinyStarsGeo.setAttribute("position", new THREE.BufferAttribute(tinyPos, 3));

  tinyStars = new THREE.Points(
    tinyStarsGeo,
    new THREE.PointsMaterial({
      color: 0x888888,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
    })
  );
  getUniverseGroup().add(tinyStars);
}

// Create Nebula
function createNebula() {
  const nebulaGeo = new THREE.BufferGeometry();
  const nebPos = new Float32Array(CONFIG.NEBULA_COUNT * 3);
  const nebCol = new Float32Array(CONFIG.NEBULA_COUNT * 3);
  const nc1 = new THREE.Color(0x4400aa); // Deep Purple
  const nc2 = new THREE.Color(0x0044aa); // Deep Blue

  for (let i = 0; i < CONFIG.NEBULA_COUNT; i++) {
    const r = 20 + Math.random() * 40;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    nebPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    nebPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
    nebPos[i * 3 + 2] = r * Math.cos(phi);

    // Reference assignment is fine here, no cloning needed
    const c = Math.random() > 0.5 ? nc1 : nc2;
    nebCol[i * 3] = c.r;
    nebCol[i * 3 + 1] = c.g;
    nebCol[i * 3 + 2] = c.b;
  }

  nebulaGeo.setAttribute("position", new THREE.BufferAttribute(nebPos, 3));
  nebulaGeo.setAttribute("color", new THREE.BufferAttribute(nebCol, 3));

  nebula = new THREE.Points(
    nebulaGeo,
    new THREE.PointsMaterial({
      size: 4.0,
      vertexColors: true,
      map: sharpTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.15,
    })
  );
  getUniverseGroup().add(nebula);
}

// Animation updates for particles
function updateParticles(time) {
  // Core pulsing
  const pulse =
    1 + Math.sin(time * CONFIG.CORE_PULSE_SPEED) * CONFIG.CORE_PULSE_AMOUNT;
  blueCore.scale.set(
    CONFIG.CORE_SCALE * pulse,
    CONFIG.CORE_SCALE * pulse,
    CONFIG.CORE_SCALE * pulse
  );
  blueCore.material.opacity =
    0.8 + Math.sin(time * CONFIG.CORE_PULSE_SPEED) * 0.2;

  // Element rotations
  planetSurface.rotation.y -= CONFIG.PLANET_ROTATION_SPEED;
  mainRing.rotation.y -= CONFIG.MAIN_RING_SPEED;
  ring2.rotation.y -= CONFIG.RING2_SPEED;
  ring3.rotation.y -= CONFIG.RING3_SPEED;
}
