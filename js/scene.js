// Three.js Scene Setup Module - OPTIMIZED VERSION

let scene, camera, renderer, universeGroup, centralSystem;

function initScene() {
  const container = document.getElementById("canvas-container");

  // Create Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.02); // Pure black fog for high contrast

  // Create Camera
  camera = new THREE.PerspectiveCamera(
    CONFIG.CAMERA_FOV,
    window.innerWidth / window.innerHeight,
    CONFIG.CAMERA_NEAR,
    CONFIG.CAMERA_FAR
  );
  camera.position.z = CONFIG.CAMERA_INITIAL_Z;

  // Create Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true, // Keep true for smooth edges, set to false if laggy on old devices
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  // OPTIMIZATION: Limit PixelRatio to 2.
  // Rendering at 3x or 4x (Retina) kills performance for particle systems.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  container.appendChild(renderer.domElement);

  // Create Universe Group (for global transformations)
  universeGroup = new THREE.Group();
  scene.add(universeGroup);

  // Create Central System (for planet, rings, core)
  centralSystem = new THREE.Group();
  centralSystem.rotation.z = Math.PI / 8;
  centralSystem.rotation.x = Math.PI / 8;
  universeGroup.add(centralSystem);

  // Handle window resize
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Also update pixel ratio on resize just in case of screen switching
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function getScene() {
  return scene;
}

function getCamera() {
  return camera;
}

function getRenderer() {
  return renderer;
}

function getUniverseGroup() {
  return universeGroup;
}

function getCentralSystem() {
  return centralSystem;
}
