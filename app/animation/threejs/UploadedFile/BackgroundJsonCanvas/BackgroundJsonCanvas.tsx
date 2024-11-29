import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import React from "react";
import {
  BackgroundProps,
  ShaderBackgroundProps,
} from "./BackgroundJsonCanvas.types";

const ShaderBackground: React.FC<ShaderBackgroundProps> = ({
  selectedFile,
}) => {
  const materialRef = React.useRef<THREE.ShaderMaterial>(null);

  // Create shader material
  const shaderMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: {
          value: new THREE.Vector2(672, 384),
        },
      },
      vertexShader: selectedFile.compiledVertexShaders[0] || "",
      fragmentShader: selectedFile.compiledFragmentShaders[0] || "",
      transparent: true,
    });
  }, [selectedFile]);
  console.log(shaderMaterial);
  // Mouse tracking (if enabled in config)
  React.useEffect(() => {
    if (selectedFile.trackMouse) {
      const handleMouseMove = (event: MouseEvent) => {
        if (materialRef.current) {
          const mouseX = event.clientX / size.width;
          const mouseY = event.clientY / size.height;
          (materialRef.current.uniforms.uMousePos.value as THREE.Vector2).set(
            mouseX,
            mouseY
          );
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [selectedFile.trackMouse, shaderMaterial]);

  // Time and animation
  useFrame((state) => {
    if (shaderMaterial) {
      const speed = selectedFile.speed || 0.25;
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />

      <shaderMaterial ref={materialRef} depthWrite={false} />
    </mesh>
  );
};

const Background: React.FC<BackgroundProps> = ({ selectedFile }) => {
  return (
    <Canvas>
      {selectedFile && <ShaderBackground selectedFile={selectedFile} />}
    </Canvas>
  );
};

export default Background;
