document.getElementById("cube").addEventListener("click",cube );
 document.getElementById("sphere").addEventListener("click",sphere );
 document.getElementById("cylinder").addEventListener("click", cylinder);

function cube() {
 camera.updateMatrixWorld();

Remove_collada();
 // Prepare ColladaLoader


  var daeLoader = new THREE.ColladaLoader();
  daeLoader.options.convertUpAxis = true;
  daeLoader.load('models/cat.dae', function(collada) {
    var mesh = collada.scene;
    // Prepare and play animation
    mesh.traverse( function (child) {
      if (child instanceof THREE.SkinnedMesh) {
        var animation = new THREE.Animation(child, child.geometry.animation);
        animation.play();
      }
    } );




    // Set position and scale
    var scale = 0.5;
    mesh.position.set(0, -20, 0);
    mesh.scale.set(scale, scale, scale);
    
    // Add the mesh into scene
    scene.add(mesh);
  

   for (let i = scene.children.length - 1; i >= 0; i--) {
      const object = scene.children[i];

      //console.log(object);

      if (object.type == 'Group') {
        object.name = "cat";

}      }
    control = new THREE.TransformControls( camera, renderer.domElement );
    control.addEventListener( 'change', render );
    control.addEventListener('mouseDown', function () {
    controls.enabled = false;
});
    control.addEventListener('mouseUp', function () {
    controls.enabled = true;
});
       control.attach( mesh );
       
         scene.add( control );
  });
    
  






}
function sphere() {
 		
    Remove_collada();
 		   // Prepare ColladaLoader
  var daeLoader = new THREE.ColladaLoader();
  daeLoader.options.convertUpAxis = true;
  daeLoader.load('models/cow.dae', function(collada) {
    var mesh = collada.scene;
    // Prepare and play animation
    mesh.traverse( function (child) {
      if (child instanceof THREE.SkinnedMesh) {
        var animation = new THREE.Animation(child, child.geometry.animation);
        animation.play();
      }
    } );
    // Set position and scale
    var scale = 0.5;
    mesh.position.set(0, -20, 0);
    mesh.scale.set(scale, scale, scale);
    // Add the mesh into scene
    scene.add(mesh);

for (let i = scene.children.length - 1; i >= 0; i--) {
      const object = scene.children[i];

      //console.log(object);

      if (object.type == 'Group') {
        object.name = "cow";

}      }

    control = new THREE.TransformControls( camera, renderer.domElement );
    control.addEventListener( 'change', render );
    control.addEventListener('mouseDown', function () {
    controls.enabled = false;
});
    control.addEventListener('mouseUp', function () {
    controls.enabled = true;
});
       control.attach( mesh );
         scene.add( control );
  });

}
function cylinder() {
   	
      Remove_collada();
       // Prepare ColladaLoader
  var daeLoader = new THREE.ColladaLoader();
  daeLoader.options.convertUpAxis = true;
  daeLoader.load('models/wolf.dae', function(collada) {
    var mesh = collada.scene;
    // Prepare and play animation
    mesh.traverse( function (child) {
      if (child instanceof THREE.SkinnedMesh) {
        var animation = new THREE.Animation(child, child.geometry.animation);
        animation.play();
      }
    } );
    // Set position and scale
    var scale = 0.5;
    mesh.position.set(0, -20, 0);
    mesh.scale.set(scale, scale, scale);
    // Add the mesh into scene
    scene.add(mesh);

for (let i = scene.children.length - 1; i >= 0; i--) {
      const object = scene.children[i];

      //console.log(object);

      if (object.type == 'Group') {
        object.name = "wolf";

}      }

    control = new THREE.TransformControls( camera, renderer.domElement );
    control.addEventListener( 'change', render );
    control.addEventListener('mouseDown', function () {
    controls.enabled = false;
});
    control.addEventListener('mouseUp', function () {
    controls.enabled = true;
});
       control.attach( mesh );
         scene.add( control );
  });

}