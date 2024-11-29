import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import styles from "./BackgroundCanvas.module.scss";
import React from "react";
import { BackgroundCanvasProps } from "./BackgroundCanvas.types";

const BackgroundCanvas: React.FC<BackgroundCanvasProps> = (props) => {
  const { selectedFile } = props;
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);

  React.useEffect(() => {
    if (!selectedFile) return;

    const loadImage = async () => {
      const reader = new FileReader();
      reader.onload = () => {
        const textureLoader = new THREE.TextureLoader();
        const loadedTexture = textureLoader.load(reader.result as string);
        setTexture(loadedTexture);
      };
      reader.readAsDataURL(selectedFile);
    };

    loadImage();
  }, [selectedFile]);

  return (
    <Canvas
      gl={{ preserveDrawingBuffer: true }}
      style={{ flex: 1 }}
      className={styles.backgroundCanvas}
    >
      {texture && (
        <mesh>
          <planeGeometry args={[16, 9]} /> {/* Adjust size as needed */}
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
      )}
    </Canvas>
  );
};

export default BackgroundCanvas;
