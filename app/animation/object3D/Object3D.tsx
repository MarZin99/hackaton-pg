"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import styles from "./Object3D.module.scss";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const Object3D: React.FC = () => {
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
      const loader = new GLTFLoader();
      debugger;
      loader.load(
        "./object3D/utils/character/scene.gltf",
        function (gltf) {
          scene.add(gltf.scene);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );

      const renderScene = () => {
        renderer.render(scene, camera);

        requestAnimationFrame(renderScene);
      };

      renderScene();
    }
  }, []);

  return <div ref={containerRef} className={styles.wrapper}></div>;
};

export default Object3D;
