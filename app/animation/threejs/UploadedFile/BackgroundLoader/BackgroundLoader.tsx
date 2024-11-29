import React from "react";
import styles from "./BackgroundLoader.module.scss";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import BackgroundLoaderComponentProps from "./BackgroundLoader.types";

const BackgroundLoaderComponent: React.FC<BackgroundLoaderComponentProps> = ({
  onBackgroundLoaded,
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
          onBackgroundLoaded?.(gltf.scene);
        },
        // Optional progress callback
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // Error callback
        (error) => {
          setError("Error loading background file");
          console.error(
            "An error occurred while loading the background file:",
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
      <button onClick={triggerFileInput}>Select GLTF</button>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {selectedFile && (
        <div className={styles.successMessage}>{selectedFile.name}</div>
      )}
    </div>
  );
};

export default BackgroundLoaderComponent;
