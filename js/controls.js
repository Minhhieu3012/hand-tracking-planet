// Gesture-to-Control Mapping Module (Smart Switching: Zoom vs Rotate)

let physicsState = {
  velocityX: 0,
  velocityY: 0,
  targetZoom: CONFIG.CAMERA_INITIAL_Z,
  isDragging: false, // Biến này = true khi bạn đang chụm tay (xoay)
  lastGestureTime: 0,
};

function updateControls() {
  const gesture = getGestureState();
  const camera = getCamera();
  const universeGroup = getUniverseGroup();

  // --- 1. XỬ LÝ ĐẦU VÀO (INPUT) ---
  if (gesture.isHandDetected) {
    // Lấy khoảng cách giữa ngón cái và ngón trỏ (đã tính bên gestures.js hoặc tính trực tiếp ở đây)
    // Giả sử gesture.pinchDistance là khoảng cách chuẩn
    const pinchDist = gesture.pinchDistance || 0;

    // NGƯỠNG QUYẾT ĐỊNH (Threshold):
    // < 0.05: Đang kẹp tay (Chế độ XOAY)
    // > 0.06: Đang mở tay (Chế độ ZOOM)
    const GRAB_THRESHOLD = 0.06;

    if (pinchDist < GRAB_THRESHOLD) {
      // === CHẾ ĐỘ XOAY (GRAB MODE) ===
      physicsState.isDragging = true;

      // Map chuyển động tay sang vận tốc xoay
      // deltaX/Y là độ dịch chuyển của tay so với frame trước
      physicsState.velocityX = gesture.deltaY * CONFIG.ROTATION_SENSITIVITY;
      physicsState.velocityY = gesture.deltaX * CONFIG.ROTATION_SENSITIVITY;
    } else {
      // === CHẾ ĐỘ ZOOM (HOVER MODE) ===
      physicsState.isDragging = false;

      // Logic Zoom:
      // Map khoảng cách ngón tay (0.06 -> 0.3) sang khoảng cách Camera (Xa -> Gần)
      // Pinch càng lớn (tay mở rộng) -> Zoom vào gần
      const minP = GRAB_THRESHOLD;
      const maxP = 0.25; // Khoảng cách mở tay tối đa thường gặp

      // Chuẩn hóa về 0 -> 1
      let t = (pinchDist - minP) / (maxP - minP);
      t = Math.max(0, Math.min(1, t)); // Kẹp giá trị lại

      // Tính Target Zoom (Đảo ngược: t lớn -> zoom gần/giá trị nhỏ)
      const targetZ = CONFIG.ZOOM_MAX - t * (CONFIG.ZOOM_MAX - CONFIG.ZOOM_MIN);

      // Chỉ cập nhật zoom nếu thay đổi đáng kể (tránh rung)
      if (Math.abs(targetZ - physicsState.targetZoom) > 0.1) {
        physicsState.targetZoom = targetZ;
      }
    }
  } else {
    // Không thấy tay -> Thả trôi
    physicsState.isDragging = false;
  }

  // --- 2. XỬ LÝ VẬT LÝ (QUÁN TÍNH) ---

  // Khi không xoay, áp dụng ma sát để vật thể trôi từ từ rồi dừng
  if (!physicsState.isDragging) {
    physicsState.velocityX *= CONFIG.INERTIA_DAMPING;
    physicsState.velocityY *= CONFIG.INERTIA_DAMPING;

    // Nếu trôi gần hết đà, chuyển sang chế độ tự quay nhẹ (Screensaver mode)
    if (
      Math.abs(physicsState.velocityX) < 0.0001 &&
      Math.abs(physicsState.velocityY) < 0.0001
    ) {
      physicsState.velocityY = CONFIG.IDLE_ROTATION_SPEED;
    }
  }

  // --- 3. RENDER (ÁP DỤNG VÀO SCENE) ---

  // Xoay trục Y (Trái/Phải)
  const qY = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    physicsState.velocityY
  );

  // Xoay trục X (Lên/Xuống)
  const qX = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    physicsState.velocityX
  );

  // Cộng dồn góc xoay vào vật thể
  universeGroup.quaternion.premultiply(qY);
  universeGroup.quaternion.premultiply(qX);

  // Smooth Zoom (Lerp)
  // Di chuyển camera từ từ đến vị trí target
  camera.position.z +=
    (physicsState.targetZoom - camera.position.z) * CONFIG.ZOOM_SMOOTH;
}
