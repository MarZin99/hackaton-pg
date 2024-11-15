"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import Box from "./Box/Box";
import styles from "./ThreeJS.module.scss";

const ThreeJS: React.FC = () => {
  return (
    <Canvas className={styles.canvas}>
      <ambientLight intensity={1} />
      {/* <spotLight position={[0, 10, 10]} angle={0.35} penumbra={1} /> */}
      <pointLight position={[-10, -10, -10]} />
      <Box
        dimension={{ width: 1, height: 1, depth: 1 }}
        color={"purple"}
        hoverColor={"yellow"}
        position={[1.2, 0, 0]}
      />
      <Box
        dimension={{ width: 1, height: 1, depth: 1 }}
        color={"red"}
        hoverColor={"green"}
        position={[-1.2, 0, 0]}
      />
    </Canvas>
  );
};

export default ThreeJS;
