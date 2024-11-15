"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import styles from "./ThreeJS2.module.scss";

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

      const renderScene = () => {
        renderer.render(scene, camera);

        requestAnimationFrame(renderScene);
      };

      renderScene();
    }
  }, []);

  return <div ref={containerRef} className={styles.wrapper}></div>;
};

export default ThreeJS;
