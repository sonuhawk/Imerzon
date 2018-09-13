function control() 

{
control = new THREE.TransformControls( camera, renderer.domElement );
    control.addEventListener( 'change', render );
    control.addEventListener('mouseDown', function () {
    controls.enabled = false;
});
    control.addEventListener('mouseUp', function () {
    controls.enabled = true;
});
       control.attach( mesh );

   };