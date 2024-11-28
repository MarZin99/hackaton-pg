"use client";

import styles from "./UploadedFile.module.scss";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GLTFLoaderComponent from "./GLTFLoader/GLTFLoader";
import SideBar from "./SideBar/SideBar";
import * as THREE from "three";

const ShaderBackground = () => {
  // Create a shader material
  const material = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;

        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
          
          // Complex background shader
          vec3 color = vec3(0.0);
          
          // Create moving waves
          float wave1 = sin(uv.x * 10.0 + time * 0.5) * 0.5 + 0.5;
          float wave2 = cos(uv.y * 8.0 - time * 0.3) * 0.5 + 0.5;
          
          // Blend waves with gradient
          color = vec3(
            0.5 + 0.5 * sin(time + uv.x * 2.0),
            0.5 + 0.5 * cos(time + uv.y * 2.0),
            0.5 + 0.5 * sin(time + length(uv) * 5.0)
          );
          
          // Add some dynamism
          color *= 1.0 + 0.2 * sin(length(uv) * 20.0 + time);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, []);

  // Animate time uniform
  useFrame(({ clock }) => {
    material.uniforms.time.value = clock.elapsedTime;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

type ModelRotationControlProps = {
  model: THREE.Object3D;
  isRotating: boolean;
  rotationAxisSpeed: {
    x: number;
    y: number;
    z: number;
  };
  rotationAxis: {
    x: boolean;
    y: boolean;
    z: boolean;
  };
};

const ModelRotationControl: React.FC<ModelRotationControlProps> = ({
  model,
  isRotating,
  rotationAxisSpeed,
  rotationAxis,
}) => {
  useFrame(() => {
    if (isRotating) {
      if (rotationAxis.x) model.rotation.x += rotationAxisSpeed.x;
      if (rotationAxis.y) model.rotation.y += rotationAxisSpeed.y;
      if (rotationAxis.z) model.rotation.z += rotationAxisSpeed.z;
    }
  });

  return null;
};

const UploadedFile: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [model, setModel] = React.useState<any>(null);
  const [color, setColor] = React.useState<string>("AAAAAA");
  const [metalness, setMetalness] = React.useState<number>(0);
  const [roughness, setRoughness] = React.useState<number>(0);
  const [isRotating, setRotation] = React.useState<boolean>(false);
  const [rotationAxisSpeed, setRotationAxisSpeed] = React.useState({
    x: 0.001,
    y: 0.001,
    z: 0.001,
  });
  const [rotationAxis, setRotationAxis] = React.useState({
    x: false,
    y: true,
    z: false,
  });

  const orbitControlsRef = React.useRef(null);

  const handleAxisRotationChange = (axis: "x" | "y" | "z") => {
    setRotationAxis((prev) => ({
      ...prev,
      [axis]: !prev[axis],
    }));
  };
  const handleRotationAxisSpeedChange = (
    axis: "x" | "y" | "z",
    speed: number
  ) => {
    setRotationAxisSpeed((prev) => ({
      ...prev,
      [axis]: speed,
    }));
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleModelLoaded = (loadedModel: any) => {
    setModel(loadedModel);
  };

  const resetCameraPosition = () => {
    orbitControlsRef.current.reset();
  };

  React.useEffect(() => {
    if (model) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      model.traverse((child: any) => {
        if (child.isMesh) {
          // Option 1: If you want to replace existing material
          child.material = new THREE.MeshStandardMaterial({
            color: "#" + color ?? "AAAAAA",
            metalness: metalness ?? child.material.metalness,
            roughness: roughness ?? child.material.roughness,
          });
        }
      });
    }
  }, [color, metalness, model, roughness]);

  return (
    <div className={styles.wrapper}>
      <SideBar name="SideBar">
        <div className={styles.sideBarContent}>
          <button onClick={resetCameraPosition}>Reset</button>
          <input
            type="text"
            placeholder="Color"
            onChange={(e) => setColor(e.target.value)}
            value={color}
          />
          <input
            type="number"
            placeholder="Roughness"
            onChange={(e) => setRoughness(Number(e.target.value))}
            value={roughness}
          />
          <input
            type="number"
            placeholder="Metalness"
            onChange={(e) => setMetalness(Number(e.target.value))}
            value={metalness}
          />
          <input
            type="checkbox"
            checked={isRotating}
            onChange={() => setRotation(!isRotating)}
          />
          {isRotating && (
            <React.Fragment>
              <div>
                Rotation Speed:
                {(["x", "y", "z"] as const).map((axis) => (
                  <label key={axis}>
                    {axis.toUpperCase()}:
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={rotationAxisSpeed[axis]}
                      onChange={(e) =>
                        handleRotationAxisSpeedChange(
                          axis,
                          Number(e.target.value)
                        )
                      }
                      disabled={!isRotating}
                    />
                  </label>
                ))}
              </div>
              <div>
                Rotation Axis:
                {(["x", "y", "z"] as const).map((axis) => (
                  <label key={axis}>
                    <input
                      type="checkbox"
                      checked={rotationAxis[axis]}
                      onChange={() => handleAxisRotationChange(axis)}
                      disabled={!isRotating}
                    />
                    {axis.toUpperCase()}
                  </label>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>
      </SideBar>
      <GLTFLoaderComponent onModelLoaded={handleModelLoaded} />
      <Canvas className={styles.backgroundCanvas}>
        <ShaderBackground />
      </Canvas>
      <Canvas style={{ flex: 1 }} className={styles.objectCanvas}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <sphereGeometry args={[500, 64, 64]} />
        {model && (
          <React.Fragment>
            <primitive object={model} scale={[1, 1, 1]} position={[0, 0, 0]} />
            <ModelRotationControl
              model={model}
              isRotating={isRotating}
              rotationAxisSpeed={rotationAxisSpeed}
              rotationAxis={rotationAxis}
            />
          </React.Fragment>
        )}

        <OrbitControls ref={orbitControlsRef} />
      </Canvas>
    </div>
  );
};

export default UploadedFile;
