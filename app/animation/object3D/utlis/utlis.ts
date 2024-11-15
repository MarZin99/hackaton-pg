function addCharacter(dir, loader, scene) {
  loader.load(
    "./character/scene.gltf",
    function (gltf) {
      scene.add(gltf.scene);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

export { addCharacter };
