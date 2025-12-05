// Three.js Scene Setup Module

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
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
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
