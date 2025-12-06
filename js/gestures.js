// MediaPipe Hand Tracking - ULTRA SMOOTH VERSION

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

// --- BỘ ĐỆM LỊCH SỬ (HISTORY BUFFER) ---
// Lưu 5 vị trí gần nhất để chia trung bình
const HISTORY_SIZE = 5;
let historyX = [];
let historyY = [];
let historyPinch = [];

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
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
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

// Hàm tính trung bình cộng của mảng
function getAverage(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}

function onHandResults(results) {
  const debugText = document.getElementById("debug-text");

  // 1. Không thấy tay -> Reset lịch sử để tránh trôi khi tay quay lại
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    gestureState.isHandDetected = false;
    gestureState.isGripping = false;

    // Reset bộ đệm khi mất tay
    historyX = [];
    historyY = [];

    debugText.innerText = "Waiting for input...";
    return;
  }

  // 2. Có tay
  gestureState.isHandDetected = true;
  const lm = results.multiHandLandmarks[0];

  // Lấy tọa độ thô
  const rawX = 1 - lm[9].x;
  const rawY = lm[9].y;

  // --- THUẬT TOÁN LÀM MƯỢT (AVERAGING) ---

  // Thêm giá trị mới vào mảng
  historyX.push(rawX);
  historyY.push(rawY);

  // Nếu mảng quá dài, bỏ bớt giá trị cũ
  if (historyX.length > HISTORY_SIZE) historyX.shift();
  if (historyY.length > HISTORY_SIZE) historyY.shift();

  // Tính vị trí trung bình
  const avgX = getAverage(historyX);
  const avgY = getAverage(historyY);

  // Tính Delta dựa trên vị trí trung bình (Cực mượt)
  // Chỉ tính delta nếu đã có vị trí cũ (tránh giật frame đầu)
  if (gestureState.handX !== 0) {
    gestureState.deltaX = avgX - gestureState.handX;
    gestureState.deltaY = avgY - gestureState.handY;
  }

  // Cập nhật vị trí hiện tại
  gestureState.handX = avgX;
  gestureState.handY = avgY;

  // --- XỬ LÝ PINCH ZOOM (Cũng làm mượt tương tự) ---
  const gripDistance = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);
  const zoomRaw = Math.hypot(lm[4].x - lm[12].x, lm[4].y - lm[12].y);

  historyPinch.push(zoomRaw);
  if (historyPinch.length > HISTORY_SIZE) historyPinch.shift();

  gestureState.pinchDistance = getAverage(historyPinch);

  // Deadzone cực nhỏ để loại bỏ rung
  if (Math.abs(gestureState.deltaX) < 0.0005) gestureState.deltaX = 0;
  if (Math.abs(gestureState.deltaY) < 0.0005) gestureState.deltaY = 0;

  // Trạng thái Lock
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
