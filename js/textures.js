// Texture Generation Module

// Generate Sharp Particle Texture
function getSharpTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  // Core glow with sharp center
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)"); // White hot center
  gradient.addColorStop(0.15, "rgba(255,255,255,1)"); // Solid core
  gradient.addColorStop(0.3, "rgba(255,255,255,0.4)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Generate Blue Glow Texture for Core
function getBlueGlow() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(200, 255, 255, 1)");
  gradient.addColorStop(0.4, "rgba(0, 100, 255, 0.8)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}
