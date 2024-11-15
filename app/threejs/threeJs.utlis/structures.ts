import * as THREE from "three";

const cubeGeometry1 = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cubeGeometry2 = new THREE.BoxGeometry(2, 2, 1);
const cubeMaterial2 = new THREE.MeshBasicMaterial({ color: 0x348900 });
const cube1 = new THREE.Mesh(cubeGeometry1, cubeMaterial1);
const cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
cube1.position.x = 2;
cube2.position.x = -2;

const CUBES = [cube1, cube2];

export { CUBES };
