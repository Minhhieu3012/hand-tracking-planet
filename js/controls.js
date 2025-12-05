// Gesture-to-Control Mapping Module (Quaternion-based Rotation)

let controlState = {
  targetQuaternion: new THREE.Quaternion(),
  targetZoom: CONFIG.CAMERA_INITIAL_Z,
};

function updateControls() {
  const gesture = getGestureState();
  const camera = getCamera();
  const universeGroup = getUniverseGroup();

  // Apply Camera Zoom (smooth)
  camera.position.z +=
    (controlState.targetZoom - camera.position.z) * CONFIG.CAMERA_SMOOTH;

  // Apply Rotation based on gesture
  if (gesture.isHandDetected) {
    switch (gesture.gestureType) {
      case "fist":
        applyFistRotation(gesture);
        break;
      case "twoFingers":
        applyZoom(gesture);
        break;
      case "openHand":
        applyRoll(gesture);
        break;
    }

    // Smooth rotation using Quaternion slerp
    universeGroup.quaternion.slerp(
      controlState.targetQuaternion,
      CONFIG.ROTATION_SMOOTH
    );
  } else {
    // Idle drift when no hand detected
    applyIdleDrift();
    universeGroup.quaternion.slerp(
      controlState.targetQuaternion,
      CONFIG.ROTATION_SMOOTH
    );
  }
}

// FIST: Rotate XY in World Space
function applyFistRotation(gesture) {
  const dX = gesture.deltaX;
  const dY = gesture.deltaY;

  // Create World-Space rotations
  // Drag Right (dX > 0) -> Rotate around World Y axis (0,1,0)
  const qY = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    dX * CONFIG.ROTATION_SENSITIVITY
  );

  // Drag Up (dY > 0) -> Rotate around World X axis (1,0,0)
  const qX = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    dY * CONFIG.ROTATION_SENSITIVITY
  );

  // Premultiply = World Space rotation
  controlState.targetQuaternion.premultiply(qY);
  controlState.targetQuaternion.premultiply(qX);
}

// TWO FINGERS: Zoom
function applyZoom(gesture) {
  const pinchDist = gesture.pinchDistance;
  const minD = CONFIG.ZOOM_MIN_DISTANCE;
  const maxD = CONFIG.ZOOM_MAX_DISTANCE;

  // Map pinch distance to zoom level
  const t = (Math.max(minD, Math.min(maxD, pinchDist)) - minD) / (maxD - minD);
  controlState.targetZoom =
    CONFIG.ZOOM_MAX - t * (CONFIG.ZOOM_MAX - CONFIG.ZOOM_MIN);
}

// OPEN HAND: Roll Z-axis
function applyRoll(gesture) {
  const dAngle = gesture.deltaAngle;

  // Only apply if movement is significant
  if (Math.abs(dAngle) > CONFIG.ROLL_THRESHOLD) {
    // Twist Right -> Rotate around World Z axis (0,0,1)
    const qZ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      dAngle * CONFIG.ROLL_SENSITIVITY
    );
    controlState.targetQuaternion.premultiply(qZ);
  }
}

// Idle Drift (slow automatic rotation)
function applyIdleDrift() {
  const driftQ = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    CONFIG.IDLE_DRIFT_SPEED
  );
  controlState.targetQuaternion.premultiply(driftQ);
}
