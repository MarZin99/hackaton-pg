"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import styles from "./ThreeJS.module.scss";
import { CUBES } from "./threeJs.utlis/structures";

const ThreeJS: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer();

      scene.add(...CUBES);
      renderer.setSize(window.innerWidth, window.innerHeight - 52);
      containerRef.current?.appendChild(renderer.domElement);
      camera.position.z = 5;

      const renderScene = () => {
        CUBES[0].rotation.x += 0.01;
        CUBES[1].rotation.x -= 0.007;
        CUBES[1].rotation.y -= 0.07;
        renderer.render(scene, camera);

        requestAnimationFrame(renderScene);
      };

      renderScene();
    }
  }, []);

  return <div ref={containerRef} className={styles.wrapper}></div>;
};

export default ThreeJS;
