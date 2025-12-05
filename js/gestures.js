// MediaPipe Hand Tracking - STABILIZED VERSION (CHỐNG RUNG)

let hands;
let gestureState = {
  isHandDetected: false,
  isGripping: false,
  handX: 0,
  handY: 0,
  deltaX: 0,
  deltaY: 0,
  pinchDistance: 0,
};

// Biến lưu vị trí cũ để làm mượt (Smoothing)
let smoothX = 0;
let smoothY = 0;
let smoothPinch = 0;

// HỆ SỐ LÀM MƯỢT (0.0 -> 1.0)
// 0.1: Rất mượt nhưng trễ (như kéo dây thun)
// 0.9: Rất nhạy nhưng rung
// 0.5: Cân bằng tốt nhất cho Iron Man UI
const SMOOTHING_FACTOR = 0.4;

function initGestures() {
  const videoElement = document.getElementById("webcam-feed");
  const statusText = document.getElementById("status-text");
  const statusDot = document.getElementById("status-dot");

  hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: CONFIG.MAX_HANDS,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
  });

  hands.onResults(onHandResults);

  const cameraUtils = new Camera(videoElement, {
    onFrame: async () => await hands.send({ image: videoElement }),
    width: CONFIG.WEBCAM_WIDTH,
    height: CONFIG.WEBCAM_HEIGHT,
  });

  cameraUtils.start().then(() => {
    statusText.innerText = "J.A.R.V.I.S ONLINE";
    statusDot.classList.replace("status-loading", "status-active");
  });
}

function onHandResults(results) {
  const debugText = document.getElementById("debug-text");

  // 1. Không thấy tay
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    gestureState.isHandDetected = false;
    gestureState.isGripping = false;
    debugText.innerText = "Waiting for input...";
    return;
  }

  // 2. Có tay -> Xử lý tọa độ
  gestureState.isHandDetected = true;
  const lm = results.multiHandLandmarks[0];

  // Lấy tọa độ thô (Raw Data)
  const rawX = 1 - lm[9].x; // Mirror X
  const rawY = lm[9].y;

  // --- THUẬT TOÁN CHỐNG RUNG (LERP) ---
  // Thay vì lấy ngay rawX, ta lấy trung bình cộng với vị trí cũ
  // Công thức: Mới = Cũ + (Đích - Cũ) * Hệ_số

  if (smoothX === 0) {
    smoothX = rawX;
    smoothY = rawY;
  } // Init frame đầu

  smoothX += (rawX - smoothX) * SMOOTHING_FACTOR;
  smoothY += (rawY - smoothY) * SMOOTHING_FACTOR;

  // Tính Delta dựa trên tọa độ ĐÃ LÀM MƯỢT
  gestureState.deltaX = smoothX - gestureState.handX;
  gestureState.deltaY = smoothY - gestureState.handY;

  // Cập nhật vị trí hiện tại
  gestureState.handX = smoothX;
  gestureState.handY = smoothY;

  // 3. XỬ LÝ PINCH/ZOOM
  const gripDistance = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);
  const zoomRaw = Math.hypot(lm[4].x - lm[12].x, lm[4].y - lm[12].y);

  // Làm mượt cả thông số Zoom luôn
  smoothPinch += (zoomRaw - smoothPinch) * SMOOTHING_FACTOR;
  gestureState.pinchDistance = smoothPinch;

  // --- VÙNG CHẾT (DEADZONE) ---
  // Nếu tay di chuyển quá ít (chỉ rung nhẹ), coi như đứng yên (delta = 0)
  if (Math.abs(gestureState.deltaX) < 0.001) gestureState.deltaX = 0;
  if (Math.abs(gestureState.deltaY) < 0.001) gestureState.deltaY = 0;

  // Phát hiện trạng thái Lock
  if (gripDistance < 0.05) {
    gestureState.isGripping = true;
    debugText.innerText = "🔒 LOCKED (Rotating)";
    debugText.style.color = "#00ffff";
    debugText.style.textShadow = "0 0 10px #00ffff";
  } else {
    gestureState.isGripping = false;
    debugText.innerText = "🖐 RELEASED (Inertia)";
    debugText.style.color = "#ffffff";
    debugText.style.textShadow = "none";
  }
}

function getGestureState() {
  return gestureState;
}
