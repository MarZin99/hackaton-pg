"use client";

import styles from "./Object3D.module.scss";
import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Environment, OrbitControls } from "@react-three/drei";

const Doggo = () => {
  const gltf = useLoader(GLTFLoader, "/Models/character/scene.gltf");
  return <primitive object={gltf.scene} />;
};

const Object3D: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Canvas>
        <Suspense fallback={null}>
          <Doggo />
          <OrbitControls />
          <Environment preset="sunset" background />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Object3D;
