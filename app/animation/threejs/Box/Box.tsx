import * as THREE from "three";
import * as React from "react";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import BoxProps from "./Box.props";

function Box(props: BoxProps) {
  const ref = useRef<THREE.Mesh>();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const { dimension, color, hoverColor } = props;

  useFrame((state, delta) => (ref.current.rotation.x += 0.01));

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => {
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      <boxGeometry
        args={[dimension.width, dimension.height, dimension.width]}
      />
      <meshStandardMaterial color={hovered ? color : hoverColor} />
    </mesh>
  );
}

export default Box;
