"use client";

import styles from "./UploadedFile.module.scss";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GLTFLoaderComponent from "./GLTFLoader/GLTFLoader";
import SideBar from "./SideBar/SideBar";
import * as THREE from "three";
import html2canvas from "html2canvas";
import BackgroundCanvas from "./BackgroundCanvas/BackgroundCanvas";
import { ShaderConfig } from "./BackgroundJsonCanvas/BackgroundJsonCanvas.types";
import { BackgroundFrame } from "./UploadedFile.types";
import { backgrounds, radioImages } from "./UploadedFile.utils";
import { Button } from "@/components/ui/button";
import MapavLogo from "./../../../../public/Icons/mapav-logo.svg";
import ImageIcon from "./../../../../public/Icons/image.svg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Block } from "@uiw/react-color";

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
  const [metalness, setMetalness] = React.useState<number>(0.1);
  const [roughness, setRoughness] = React.useState<number>(0.1);
  const [isRotating, setRotation] = React.useState<boolean>(true);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [rotationAxisSpeed, setRotationAxisSpeed] = React.useState({
    x: 0.001,
    y: 0.001,
    z: 0.001,
  });
  const [rotationAxis, setRotationAxis] = React.useState({
    x: true,
    y: true,
    z: true,
  });
  const [iFrame, setIFrame] = React.useState<BackgroundFrame>(null);
  const [isIFrame, setIsIFrame] = React.useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const workspaceRef = React.useRef<HTMLDivElement | null>(null);

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

  const backgroundCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const objectCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const printCanvas2 = async () => {
    console.log("workspaceRef:", workspaceRef.current);
    console.log("backgroundCanvasRef:", backgroundCanvasRef.current);
    console.log("objectCanvasRef:", objectCanvasRef.current);
    if (
      !workspaceRef.current ||
      !backgroundCanvasRef.current ||
      !objectCanvasRef.current
    ) {
      console.error("Missing required elements for screenshot.");
      return;
    }

    const backgroundCanvas = await html2canvas(backgroundCanvasRef.current, {
      logging: true, // Optional for debugging
      useCORS: true, // Ensures external resources are captured
    });

    const objectCanvas = await html2canvas(objectCanvasRef.current, {
      logging: true, // Optional for debugging
      useCORS: true, // Ensures external resources are captured
    });

    // Step 1: Capture background canvas
    const backgroundCanvasImage = backgroundCanvas.toDataURL("image/png");

    // Step 2: Capture object canvas
    const objectCanvasImage = objectCanvas.toDataURL("image/png");

    // Step 3: Capture rest of the parent div using html2canvas (excluding canvases)
    const workspaceImage = await html2canvas(workspaceRef.current, {
      ignoreElements: (el) =>
        el === backgroundCanvasRef.current || el === objectCanvasRef.current,
    });

    // Step 4: Combine all layers
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = workspaceImage.width;
    finalCanvas.height = workspaceImage.height;

    const ctx = finalCanvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get canvas 2D context.");
      return;
    }

    const backgroundImg = new Image();
    const objectImg = new Image();
    backgroundImg.src = backgroundCanvasImage;
    objectImg.src = objectCanvasImage;

    await Promise.all([
      new Promise<void>((resolve) => (backgroundImg.onload = () => resolve())),
      new Promise<void>((resolve) => (objectImg.onload = () => resolve())),
    ]);

    // Draw the layers in the correct order
    ctx.drawImage(workspaceImage, 0, 0);
    ctx.drawImage(backgroundImg, 0, 0);
    ctx.drawImage(objectImg, 0, 0);

    // Step 5: Save the final combined image
    const finalImage = finalCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = finalImage;
    link.download = "workspace.png";
    link.click();
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

  const [shaderConfig, setShaderConfig] = React.useState<ShaderConfig | null>(
    null
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedConfig1 = JSON.parse(content);
          const parsedConfig = parsedConfig1.history[0];

          // Optional: Add some validation
          if (
            parsedConfig.compiledVertexShaders &&
            parsedConfig.compiledFragmentShaders
          ) {
            setShaderConfig(parsedConfig);
          } else {
            console.error("Invalid shader configuration");
            alert(
              "The uploaded file does not contain a valid shader configuration."
            );
          }
        } catch (error) {
          console.error("Error parsing JSON", error);
          alert("Failed to parse the JSON file. Please check the file format.");
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className={styles.wrapper}>
      <SideBar side="left">
        <div className={styles.leftSidebarWrapper}>
          <div className={styles.iconAndButton}>
            <div className={styles.iconWrapper}>
              <MapavLogo className={styles.icon} />
            </div>
            <div className={styles.buttonWrapper}>
              <GLTFLoaderComponent onModelLoaded={handleModelLoaded} />
            </div>
          </div>
          <div className={styles.hjumor}>
            <div className={styles.selectBg}>
              <ImageIcon className={styles.imageIcon} />
              <p>Select Background</p>
            </div>
            <div className={styles.models}>
              {radioImages.map((img, i) => (
                <div className={styles.modelsIconWrapper}>
                  <img
                    src={img.src}
                    key={i}
                    className={styles.modelsIcon}
                    onClick={() => setIFrame(backgrounds[i])}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SideBar>
      <SideBar side="right">
        <div className={styles.sideBarContent}>
          {/* <Button onClick={printCanvas2}>Save Fle</Button> */}
          {/* <input type="file" onChange={handleFileChange} /> */}
          <Block
            color={color}
            onChange={(color) => setColor(color.hex)}
            hidden
          />
          <Label htmlFor="color" className="text-white">
            Color
          </Label>
          <Input
            type="text"
            id="color"
            placeholder="Color"
            onChange={(e) => setColor(e.target.value)}
            value={color}
          />
          <Label htmlFor="roughness" className="text-white">
            Roughness
          </Label>
          <Slider
            id="roughness"
            value={[roughness]}
            defaultValue={[0]}
            max={1}
            step={0.01}
            onValueChange={(e) => setRoughness(Number(e[0]))}
          />

          <Label htmlFor="Metalness" className="text-white">
            Metalness
          </Label>
          <Slider
            id="Metalness"
            value={[metalness]}
            defaultValue={[0]}
            max={1}
            step={0.01}
            onValueChange={(e) => setMetalness(Number(e[0]))}
          />

          <input
            type="checkbox"
            checked={isRotating}
            onChange={() => setRotation(!isRotating)}
            hidden
          />
          {isRotating && (
            <React.Fragment>
              <div>
                <Label className="text-white mb-1 block">Rotation Speed:</Label>
                {(["x", "y", "z"] as const).map((axis) => (
                  <div className="flex items-center">
                    <Label className="text-white mb-3 block">
                      {axis.toUpperCase()}:
                    </Label>
                    <Slider
                      id="Metalness"
                      value={[rotationAxisSpeed[axis]]}
                      defaultValue={[0]}
                      max={1}
                      step={0.001}
                      onValueChange={(e) =>
                        handleRotationAxisSpeedChange(axis, Number(e[0]))
                      }
                      disabled={!isRotating}
                    />
                  </div>
                ))}
              </div>
              <div hidden>
                <Label className="text-white mb-3 block">Rotation Axis:</Label>
                {(["x", "y", "z"] as const).map((axis) => (
                  <div className="flex items-center">
                    <Label className="text-white mb-3 block">
                      {axis.toUpperCase()}:
                    </Label>
                    <input
                      type="checkbox"
                      checked={rotationAxis[axis]}
                      onChange={() => handleAxisRotationChange(axis)}
                    />
                    {axis.toUpperCase()}
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
          <input
            type="checkbox"
            onClick={() => setIsIFrame(!isIFrame)}
            hidden
          />
          {isIFrame &&
            backgrounds.map((bg, i) => (
              <input
                key={i}
                type="radio"
                onClick={() => setIFrame(bg)}
                hidden
              />
            ))}
          <Button onClick={resetCameraPosition}>Reset</Button>
        </div>
      </SideBar>
      <div ref={workspaceRef} className={styles.workspace}>
        {iFrame && (
          <iframe
            src={iFrame.src}
            width="672px"
            height="384px"
            loading="lazy"
            style={{ zIndex: 2, position: "absolute" }}
          ></iframe>
        )}
        <BackgroundCanvas selectedFile={selectedFile} />

        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          ref={objectCanvasRef}
          style={{ flex: 1 }}
          className={styles.objectCanvas}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <sphereGeometry args={[500, 64, 64]} />
          {model && (
            <React.Fragment>
              <primitive
                object={model}
                scale={[1, 1, 1]}
                position={[0, 0, 0]}
              />
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
    </div>
  );
};

export default UploadedFile;
