"use client";

import styles from "./Logo.module.scss";
import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Environment, OrbitControls } from "@react-three/drei";

const LogoObject = () => {
  const gltf = useLoader(GLTFLoader, "/Models/logo/mapaw.gltf");
  return <primitive object={gltf.scene} />;
};

const Logo: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Canvas>
        <Suspense fallback={null}>
          <LogoObject />
          <OrbitControls />
          <Environment preset="sunset" background />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Logo;
