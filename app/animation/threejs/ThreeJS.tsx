"use client";

import React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Box from "./Box/Box";

const ThreeJS: React.FC = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Box
        dimension={{ width: 1, height: 1, depth: 1 }}
        color={THREE.Color["red"]}
        position={[1.2, 0, 0]}
      />
      <Box
        dimension={{ width: 1, height: 1, depth: 1 }}
        color={THREE.Color["red"]}
        position={[-1.2, 0, 0]}
      />
    </Canvas>
  );
};

export default ThreeJS;
