import React from "react";
import styles from "./GLTFLoader.module.scss";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GLTFLoaderComponentProps from "./GLTFLoader.types";
import { Button } from "@/components/ui/button";

const GLTFLoaderComponent: React.FC<GLTFLoaderComponentProps> = ({
  onModelLoaded,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loadedModel, setLoadedModel] = React.useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setError(null);
    setSelectedFile(null);
    setLoadedModel(null);

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".gltf")) {
      setError("Please select a valid .gltf file");
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File is too large. Maximum size is 50MB");
      return;
    }

    const fileUrl = URL.createObjectURL(file);

    try {
      const loader = new GLTFLoader();
      loader.load(
        fileUrl,
        (gltf) => {
          setSelectedFile(file);
          setLoadedModel(gltf.scene);
          onModelLoaded?.(gltf.scene);
        },
        // Optional progress callback
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // Error callback
        (error) => {
          setError("Error loading GLTF file");
          console.error(
            "An error occurred while loading the GLTF file:",
            error
          );
        }
      );
    } catch (err) {
      setError("Error processing file");
      console.error(err);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.gltfLoader}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".gltf"
        className={styles.hiddenInput}
      />
      <Button onClick={triggerFileInput}>Select File</Button>
    </div>
  );
};

export default GLTFLoaderComponent;
