// MediaPipe Hand Tracking & Gesture Detection Module - IRON MAN EDITION

let hands;
let gestureState = {
  isHandDetected: false,
  isGripping: false, // Trạng thái "đang cầm" (Pinch hoặc Fist)
  handX: 0,
  handY: 0,
  deltaX: 0,
  deltaY: 0,
  pinchDistance: 0, // Khoảng cách zoom (ngón cái - ngón giữa/út)
};

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

  // Lấy tọa độ trung tâm (Lòng bàn tay - Landmark 9)
  const currentX = 1 - lm[9].x; // Đảo ngược trục X (Mirror)
  const currentY = lm[9].y;

  // Tính độ dịch chuyển (Delta) cho quán tính
  gestureState.deltaX = currentX - gestureState.handX;
  gestureState.deltaY = currentY - gestureState.handY;

  // Cập nhật vị trí mới
  gestureState.handX = currentX;
  gestureState.handY = currentY;

  // 3. PHÁT HIỆN CỬ CHỈ (Logic mới)

  // Khoảng cách giữa ĐẦU NGÓN CÁI (4) và ĐẦU NGÓN TRỎ (8)
  const gripDistance = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);

  // Khoảng cách ZOOM: Giữa NGÓN CÁI (4) và NGÓN GIỮA (12)
  // Dùng ngón giữa để zoom tách biệt với ngón trỏ (để xoay)
  const zoomDistance = Math.hypot(lm[4].x - lm[12].x, lm[4].y - lm[12].y);
  gestureState.pinchDistance = zoomDistance;

  // NGƯỠNG KÍCH HOẠT (Threshold)
  // Nếu ngón cái và trỏ gần nhau (< 0.05) -> Đang cầm (GRIPPING)
  if (gripDistance < 0.05) {
    gestureState.isGripping = true;
    debugText.innerText = "🔒 LOCKED (Rotating)";
    debugText.style.color = "#00ffff"; // Cyan color
  } else {
    gestureState.isGripping = false;

    // Nếu không cầm, kiểm tra xem có đang Zoom không
    // (Ngón cái xa ngón trỏ, nhưng gần ngón giữa?) - Logic đơn giản hóa:
    // Chỉ hiện thông báo trạng thái thả trôi
    debugText.innerText = "🖐 RELEASED (Inertia)";
    debugText.style.color = "#ffffff";
  }
}

function getGestureState() {
  return gestureState;
}
