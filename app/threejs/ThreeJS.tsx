"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import styles from "./ThreeJS.module.scss";

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
      //--STRUCTURES
      const cubeGeometry1 = new THREE.BoxGeometry(1, 1, 1);
      const cubeMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cubeGeometry2 = new THREE.BoxGeometry(2, 2, 1);
      const cubeMaterial2 = new THREE.MeshBasicMaterial({ color: 0x348900 });
      const cube1 = new THREE.Mesh(cubeGeometry1, cubeMaterial1);
      const cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
      //--//STRUCTURES

      scene.add(cube1, cube2);
      renderer.setSize(window.innerWidth, window.innerHeight - 52);
      containerRef.current?.appendChild(renderer.domElement);
      camera.position.z = 5;

      const renderScene = () => {
        cube1.rotation.x += 0.01;
        cube2.rotation.y += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(renderScene);
      };

      renderScene();
    }
  }, []);

  return <div ref={containerRef} className={styles.wrapper}></div>;
};

export default ThreeJS;
