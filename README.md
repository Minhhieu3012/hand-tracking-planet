# 🌌 Stark HUD: Interactive Particle Universe

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Technology](https://img.shields.io/badge/Tech-Three.js%20|%20MediaPipe%20|%20WebGL-blueviolet)
![License](https://img.shields.io/badge/License-MIT-blue)

> An immersive 3D planetary system controlled by real-time hand gestures. Inspired by the J.A.R.V.I.S interface from Iron Man, this project blends high-performance WebGL graphics with computer vision AI.

---

## 📖 About The Project

**Stark HUD** is a web-based experiment that explores the future of Human-Computer Interaction (HCI). Instead of using a mouse or keyboard, users manipulate a complex 3D particle system using natural hand movements captured via webcam.

The application features a physics-based control engine, allowing users to "grab," "throw," and "catch" the planet with realistic inertia and momentum.

### ✨ Key Features

- **Real-time Hand Tracking:** Powered by Google's MediaPipe, tracking 21 3D landmarks on the hand with high precision.
- **Volumetric 3D Rendering:** Generates 30,000+ individual particles using Three.js to create a mesmerizing star core, rings, and nebula.
- **Physics-Based Interaction:**
  - **Inertia System:** Objects carry momentum when thrown, drifting smoothly through space.
  - **Stabilization Algorithm:** Custom Lerp (Linear Interpolation) smoothing to eliminate webcam jitter.
- **Responsive Holographic UI:** A futuristic "Glass" interface that reacts to gesture states (Locked/Released).

---

## 🛠️ Built

- **[Three.js](https://threejs.org/)** - For WebGL 3D rendering and particle systems.
- **[MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands)** - For machine learning-based hand tracking.
- **[Tailwind CSS](https://tailwindcss.com/)** - For rapid UI styling.
- **Vanilla JavaScript (ES6+)** - Core logic (Modular architecture).

---

## 🎮 How to Control (J.A.R.V.I.S Interface)

The system uses a "Pinch-to-Interact" logic similar to sci-fi holographic interfaces.

| Gesture                | Action            | Description                                                                                          |
| :--------------------- | :---------------- | :--------------------------------------------------------------------------------------------------- |
| **👌 Pinch (Hold)**    | **Grab & Rotate** | Touch your **Thumb** and **Index** finger together. Move your hand to rotate the planet.             |
| **👋 Swipe & Release** | **Inertia Throw** | While pinching, move your hand quickly and release the pinch mid-air to "throw" the planet.          |
| **🖐 Open Hand**       | **Zoom Control**  | Release the pinch. Move your Thumb and Index finger **apart** to Zoom In, or **closer** to Zoom Out. |

---

## 🚀 Getting Started

To run this project locally, you need a local server (due to browser security policies regarding Webcam and Texture loading).

### Prerequisites

- A modern web browser (Chrome, Edge, or Firefox).
- A code editor (VS Code recommended).
- A webcam.

### Installation

1.  **Clone the repository**

    ```bash
    git clone: https://github.com/Minhhieu3012/stark-hud-interface.git
    ```

2.  **Run with Live Server**

    - If you are using **VS Code**, install the "Live Server" extension.
    - Right-click on `index.html` and select **"Open with Live Server"**.

3.  **Access the App**
    Open your browser and go to `http://127.0.0.1:5500` (or the port shown in your terminal). Allow camera permissions when prompted.
