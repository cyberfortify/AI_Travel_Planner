import { useEffect, useRef } from "react";
import * as THREE from "three";

const LoadingSpinner = ({ onDone }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 2000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 200;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.2, transparent: true, opacity: 0.7,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Plane image
    let plane;
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/images/plane.png");
    const geometry = new THREE.PlaneGeometry(4, 4);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, -30);
    scene.add(plane);

    const clock = new THREE.Clock();
    let frameId;
    let doneCalled = false;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const duration = 0.9; // total animation duration in seconds
      const t = Math.min(elapsed / duration, 1);

      if (plane) {
        // Zoom forward
        plane.position.z = THREE.MathUtils.lerp(-90, 2, t);

        // Scale up — plane fills screen and BEYOND (overshoot for flash effect)
        const scale = THREE.MathUtils.lerp(1, 14, t);
        plane.scale.set(scale, scale, scale);

        // Slight tilt
        plane.rotation.z = Math.sin(elapsed * 2) * 0.1;

        // Keep fully opaque until the very end — let App.js flash handle transition
        plane.material.opacity = t > 0.92 ? 1 - (t - 0.92) / 0.08 : 1;

        // When zoom is almost complete, trigger flash transition
        if (t >= 0.9 && !doneCalled) {
          doneCalled = true;
          onDone?.();
        }
      }

      stars.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      const w2 = mount.clientWidth;
      const h2 = mount.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "linear-gradient(170deg, #060d1f 0%, #0b1e45 40%, #0f3272 70%, #1a5298 100%)",
      }}
    >
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

      {/* Vignette */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Bottom text */}
      <div style={{ position: "absolute", bottom: "40px", left: 0, right: 0, textAlign: "center" }}>
        <p style={{
          color: "rgba(255,255,255,0.5)", fontSize: "12px",
          letterSpacing: "4px", textTransform: "uppercase", margin: 0,
        }}>
          Fasten your seatbelt… your adventure is about to take off ✈️
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;