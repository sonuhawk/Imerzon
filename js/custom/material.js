 var setMaterial = function(node, material) {
  node.material = material;
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      setMaterial(node.children[i], material);
    }
  }
}
setMaterial(mesh, new THREE.MeshBasicMaterial({color: 0xff0000}));
