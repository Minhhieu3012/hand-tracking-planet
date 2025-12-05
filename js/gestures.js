// MediaPipe Hand Tracking & Gesture Detection Module - OPTIMIZED VERSION

let hands;
let gestureState = {
  isHandDetected: false,
  gestureType: "none", // 'fist', 'twoFingers', 'openHand'
  handX: 0,
  handY: 0,
  prevHandX: 0,
  prevHandY: 0,
  handAngle: 0,
  prevHandAngle: 0,
  pinchDistance: 0,
  deltaX: 0,
  deltaY: 0,
  deltaAngle: 0,
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
    modelComplexity: CONFIG.MODEL_COMPLEXITY,
    minDetectionConfidence: CONFIG.MIN_DETECTION_CONFIDENCE,
    minTrackingConfidence: CONFIG.MIN_TRACKING_CONFIDENCE,
  });

  hands.onResults(onHandResults);

  const cameraUtils = new Camera(videoElement, {
    onFrame: async () => await hands.send({ image: videoElement }),
    width: CONFIG.WEBCAM_WIDTH,
    height: CONFIG.WEBCAM_HEIGHT,
  });

  cameraUtils.start().then(() => {
    statusText.innerText = "System Online";
    statusDot.classList.replace("status-loading", "status-active");
  });
}

function onHandResults(results) {
  const debugText = document.getElementById("debug-text");

  // No hand detected
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    gestureState.isHandDetected = false;
    gestureState.gestureType = "none";
    debugText.innerText = "Scanning Space...";
    return;
  }

  gestureState.isHandDetected = true;
  const lm = results.multiHandLandmarks[0];

  // Update hand position (mirror X coordinate)
  gestureState.prevHandX = gestureState.handX;
  gestureState.prevHandY = gestureState.handY;
  gestureState.handX = 1 - lm[9].x; // Middle finger MCP
  gestureState.handY = lm[9].y;

  // Calculate deltas
  gestureState.deltaX = gestureState.handX - gestureState.prevHandX;
  gestureState.deltaY = gestureState.handY - gestureState.prevHandY;

  // Detect gesture type
  const gesture = detectGesture(lm);
  gestureState.gestureType = gesture.type;

  // Update debug text based on gesture
  switch (gesture.type) {
    case "fist":
      debugText.innerText = "✊ ROTATING XY";
      break;
    case "twoFingers":
      gestureState.pinchDistance = gesture.pinchDistance;
      debugText.innerText = `✌️ ZOOMING: ${gesture.pinchDistance.toFixed(2)}`;
      break;
    case "openHand":
      gestureState.prevHandAngle = gestureState.handAngle;
      gestureState.handAngle = gesture.angle;

      let dAngle = gestureState.handAngle - gestureState.prevHandAngle;

      // Fix wrap-around issues (e.g. from PI to -PI)
      if (dAngle > Math.PI) dAngle -= Math.PI * 2;
      if (dAngle < -Math.PI) dAngle += Math.PI * 2;

      // OPTIMIZATION: Deadzone filtering (Lọc nhiễu)
      // Nếu góc xoay quá nhỏ, coi như không xoay để tránh màn hình rung lắc
      if (Math.abs(dAngle) < 0.03) {
        dAngle = 0;
      }

      gestureState.deltaAngle = dAngle;

      debugText.innerText = "🖐 TWIST: Rolling Z-Axis";
      break;
    default:
      debugText.innerText = "👋 Unknown Gesture";
  }
}

function detectGesture(landmarks) {
  // Helper: Check if finger is folded
  const isFolded = (tip, pip) =>
    Math.hypot(
      landmarks[tip].x - landmarks[0].x,
      landmarks[tip].y - landmarks[0].y
    ) <
    Math.hypot(
      landmarks[pip].x - landmarks[0].x,
      landmarks[pip].y - landmarks[0].y
    );

  const indexFolded = isFolded(8, 6);
  const middleFolded = isFolded(12, 10);
  const ringFolded = isFolded(16, 14);
  const pinkyFolded = isFolded(20, 18);

  // Detect FIST: All fingers folded
  if (indexFolded && middleFolded && ringFolded && pinkyFolded) {
    return { type: "fist" };
  }

  // Detect TWO FINGERS: Index extended, others folded
  if (!indexFolded && middleFolded && ringFolded && pinkyFolded) {
    const pinchDist = Math.hypot(
      landmarks[4].x - landmarks[8].x,
      landmarks[4].y - landmarks[8].y
    );
    return { type: "twoFingers", pinchDistance: pinchDist };
  }

  // Detect OPEN HAND: Not fist, not two fingers
  // Calculate hand roll angle using wrist and middle finger MCP
  const dx = landmarks[9].x - landmarks[0].x;
  const dy = landmarks[9].y - landmarks[0].y;
  const angle = Math.atan2(dy, dx);

  return { type: "openHand", angle: angle };
}

function getGestureState() {
  return gestureState;
}
