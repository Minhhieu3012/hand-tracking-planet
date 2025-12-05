// Main Initialization & Animation Loop

let time = 0;

// Initialize UI
function initUI() {
  const toggleBtn = document.getElementById("toggle-ui-btn");
  const uiLayer = document.getElementById("ui-layer");

  toggleBtn.addEventListener("click", () => {
    uiLayer.classList.toggle("hidden-ui");
  });
}

// Main Animation Loop
function animate() {
  requestAnimationFrame(animate);

  time += 0.015;

  // Update controls (camera zoom + rotation)
  updateControls();

  // Update particle animations
  updateParticles(time);

  // Render scene
  const scene = getScene();
  const camera = getCamera();
  const renderer = getRenderer();
  renderer.render(scene, camera);
}

// Start the application
function init() {
  console.log("🌌 Initializing Golden Universe...");

  // Initialize UI
  initUI();

  // Initialize Three.js scene
  initScene();
  console.log("✅ Scene initialized");

  // Initialize particles
  initParticles();
  console.log("✅ Particles created");

  // Initialize hand tracking
  initGestures();
  console.log("✅ Hand tracking initialized");

  // Start animation loop
  animate();
  console.log("✅ Animation started");

  console.log("🚀 Golden Universe is ready!");
}

// Start when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
