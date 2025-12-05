// Configuration & Constants - J.A.R.V.I.S THEME

const CONFIG = {
  // --- PARTICLE COUNTS (Tăng nhẹ số lượng hạt để hình ảnh mịn hơn) ---
  SURFACE_PARTICLE_COUNT: 10000,
  MAIN_RING_PARTICLES: 14000,
  RING2_PARTICLES: 7000,
  RING3_PARTICLES: 7000,
  STAR_COUNT: 4000,
  TINY_STAR_COUNT: 2000,
  NEBULA_COUNT: 600,

  // --- DIMENSIONS ---
  PLANET_RADIUS: 1.9,
  PLANET_DEPTH: 0.4,
  SURFACE_PARTICLE_SIZE: 0.07, // Hạt nhỏ hơn một chút cho sắc nét

  CORE_SCALE: 3.5,
  CORE_PULSE_SPEED: 2.5,
  CORE_PULSE_AMOUNT: 0.15,

  MAIN_RING_INNER: 3.2,
  MAIN_RING_OUTER: 6.0,
  RING2_INNER: 6.2,
  RING2_OUTER: 7.0,
  RING3_INNER: 7.2,
  RING3_OUTER: 7.8,

  // --- JARVIS COLOR PALETTE (QUAN TRỌNG) ---
  // Màu chủ đạo là Cyan (Xanh lơ) và Blue (Xanh dương đậm)
  PLANET_COLOR1: 0x00ffff, // Cyan sáng (Arc Reactor)
  PLANET_COLOR2: 0x0055ff, // Deep Blue (Hologram shadow)
  CORE_COLOR: 0xffffff, // Trắng tinh khiết ở tâm

  MAIN_RING_COLOR1: 0x00aaff, // Light Blue
  MAIN_RING_COLOR2: 0x002244, // Dark Navy transparency

  // --- CAMERA ---
  CAMERA_FOV: 75,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 1000,
  CAMERA_INITIAL_Z: 9,

  // --- PHYSICS & CONTROLS ---
  ROTATION_SENSITIVITY: 6.0, // Tăng độ nhạy xoay
  INERTIA_DAMPING: 0.94, // Độ trôi mượt mà
  MIN_VELOCITY: 0.0001,
  IDLE_ROTATION_SPEED: 0.0008,

  ZOOM_MIN: 3.0,
  ZOOM_MAX: 16.0,
  ZOOM_SMOOTH: 0.1,

  // --- ANIMATION ---
  PLANET_ROTATION_SPEED: 0.002,
  MAIN_RING_SPEED: 0.003,
  RING2_SPEED: 0.004,
  RING3_SPEED: 0.002,

  // --- MEDIAPIPE ---
  MAX_HANDS: 1,
  MODEL_COMPLEXITY: 1,
  MIN_DETECTION_CONFIDENCE: 0.6,
  MIN_TRACKING_CONFIDENCE: 0.6,
  WEBCAM_WIDTH: 320,
  WEBCAM_HEIGHT: 240,
};
