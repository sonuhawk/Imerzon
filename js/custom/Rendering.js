// MAIN
// standard global variables
var container, scene, camera, renderer, controls, control,stats;
THREE.Cache.enabled = true;
var permalink, hex, color;
var cameraTarget ;
var group, textMesh1, textMesh2, textGeo, materials;
var firstLetter = true;
var text = "Animal",
height = 22,
size = 50,
hover = 12,
curveSegments = .1,
bevelThickness = .1,
bevelSize = .1,
bevelSegments = .1,
bevelEnabled = true,
font = undefined,
fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
fontWeight = "bold"; // normal bold
var mirror = false;
var fontMap = {
"helvetiker": 0,
"optimer": 1,
"gentilis": 2,
"droid/droid_sans": 3,
"droid/droid_serif": 4
};
var weightMap = {
"regular": 0,
"bold": 1
};
var reverseFontMap = [];
var reverseWeightMap = [];
for ( var i in fontMap ) reverseFontMap[ fontMap[i] ] = i;
for ( var i in weightMap ) reverseWeightMap[ weightMap[i] ] = i;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var fontIndex = 1;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var cube
init();
animate();
// FUNCTIONS
function decimalToHex( d ) {
var hex = Number( d ).toString( 16 );
hex = "000000".substr( 0, 6 - hex.length ) + hex;
return hex.toUpperCase();
}
function init()
{

//text
// SCENE
this.scene = new THREE.Scene();
// CAMERA
var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
scene.add(camera);
camera.position.set(0,200,1200);
camera.lookAt(scene.position);

// RENDERER
if ( Detector.webgl )
renderer = new THREE.WebGLRenderer( {antialias:true} );
else
renderer = new THREE.CanvasRenderer();
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
container = document.getElementById( 'ThreeJS' );
container.appendChild( renderer.domElement );

// EVENTS
THREEx.WindowResize(renderer, camera);
THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

///text
//var plane = new THREE.Mesh(
///new THREE.PlaneBufferGeometry( 10000, 10000 ),
//new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
//);
//plane.position.y = 100;
//plane.rotation.x = - Math.PI / 2;
// scene.add( plane );
// RENDERER
/*renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );
*/
//labels
this.text3 = function()
{
alert("text added - Press OK ");
permalink = document.getElementById( "permalink" );
var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
pointLight.position.set( 0, 100, 90 );
//scene.add( pointLight );
var hash = document.location.hash.substr( 1 );
if ( hash.length !== 0 ) {
var colorhash  = hash.substring( 0, 6 );
var fonthash   = hash.substring( 6, 7 );
var weighthash = hash.substring( 7, 8 );
var bevelhash  = hash.substring( 8, 9 );
var texthash   = hash.substring( 10 );
hex = colorhash;
pointLight.color.setHex( parseInt( colorhash, 16 ) );
fontName = reverseFontMap[ parseInt( fonthash ) ];
fontWeight = reverseWeightMap[ parseInt( weighthash ) ];
bevelEnabled = parseInt( bevelhash );
text= document.getElementById('text2').value;//.value;
var nnn = text;
// text = "This is a Test only" ;//decodeURI( texthash );
updatePermalink();
} else {
pointLight.color.setHSL( Math.random(), 1, 0.5 );
hex = decimalToHex( pointLight.color.getHex() );
}
materials = [
new THREE.MeshPhongMaterial( { color: 0x2ECC71, flatShading: true } ), // front
new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
];
group = new THREE.Group();
group.position.x = 500;
scene.add( group );
/*for (let i = scene.children.length - 1; i >= 0; i--) {
const object = scene.children[i];
console.log(object);
if (object.type == 'Group') {
object.name = "text";
}      }*/
loadFont();
function boolToNum( b ) {
return b ? 1 : 0;
}
function updatePermalink() {
var link = hex + fontMap[ fontName ] + weightMap[ fontWeight ] + boolToNum( bevelEnabled ) + "#" + encodeURI( text );
//permalink.href = "#" + link;
window.location.hash = link;
}
function onDocumentKeyDown( event ) {
if ( firstLetter ) {
firstLetter = false;
text = "";
}
var keyCode = event.keyCode;
// backspace
if ( keyCode == 8 ) {
event.preventDefault();
text = text.substring( 0, text.length - 1 );
refreshText();
return false;
}
}
function onDocumentKeyPress( event ) {
var keyCode = event.which;
// backspace
if ( keyCode == 8 ) {
event.preventDefault();
} else {
var ch = String.fromCharCode( keyCode );
text += ch;
refreshText();
}
}
function loadFont() {
var loader = new THREE.FontLoader();
loader.load( 'fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {
font = response;
refreshText();
} );
}
function createText() {
textGeo = new THREE.TextGeometry( text, {
font: font,
size: size,
height: height,
curveSegments: curveSegments,
bevelThickness: bevelThickness,
bevelSize: bevelSize,
bevelEnabled: bevelEnabled
});
textGeo.computeBoundingBox();
textGeo.computeVertexNormals();
// "fix" side normals by removing z-component of normals for side faces
// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
if ( ! bevelEnabled ) {
var triangleAreaHeuristics = 0.1 * ( height * size );
for ( var i = 0; i < textGeo.faces.length; i ++ ) {
var face = textGeo.faces[ i ];
if ( face.materialIndex == 1 ) {
for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
face.vertexNormals[ j ].z = 0;
face.vertexNormals[ j ].normalize();
}
var va = textGeo.vertices[ face.a ];
var vb = textGeo.vertices[ face.b ];
var vc = textGeo.vertices[ face.c ];
var s = THREE.GeometryUtils.triangleArea( va, vb, vc );
if ( s > triangleAreaHeuristics ) {
for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
face.vertexNormals[ j ].copy( face.normal );
}
}
}
}
}
var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );
textMesh1 = new THREE.Mesh( textGeo, materials );
textMesh1.position.x = centerOffset;
textMesh1.position.y = hover;
textMesh1.position.z = 0;
textMesh1.rotation.x = 0;
textMesh1.rotation.y = Math.PI * 2;
group.add( textMesh1 );
if ( mirror ) {
textMesh2 = new THREE.Mesh( textGeo, materials );
textMesh2.position.x = centerOffset;
textMesh2.position.y = -hover;
textMesh2.position.z = height;
textMesh2.rotation.x = Math.PI;
textMesh2.rotation.y = Math.PI * 2;
group.add( textMesh2 );
}
}
function refreshText() {
updatePermalink();
group.remove( textMesh1 );
if ( mirror ) group.remove( textMesh2 );
if ( !text ) return;
createText();
}
function onDocumentMouseDown( event ) {
event.preventDefault();
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mouseup', onDocumentMouseUp, false );
document.addEventListener( 'mouseout', onDocumentMouseOut, false );
mouseXOnMouseDown = event.clientX - windowHalfX;
targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove( event ) {
mouseX = event.clientX - windowHalfX;
targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}
function onDocumentMouseUp( event ) {
document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentMouseOut( event ) {
document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentTouchStart( event ) {
if ( event.touches.length == 1 ) {
event.preventDefault();
mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
targetRotationOnMouseDown = targetRotation;
}
}
function onDocumentTouchMove( event ) {
if ( event.touches.length == 1 ) {
event.preventDefault();
mouseX = event.touches[ 0 ].pageX - windowHalfX;
targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
}
}
control1.attach( group );
scene.add( control1 );
//control.setTranslationSnap( 100 );
// control.setRotationSnap( THREE.Math.degToRad( 15 ) );
};
// CONTROLS
//controls = new THREE.OrbitControls( camera,renderer.domElement);
controls = new THREE.EditorControls( camera ,renderer.domElement );
//controls.autoRotate = true;
//controls.autoRotateSpeed = 10;
controls.target = new THREE.Vector3(.5, .5, .5);
controls.panningMode = 1;
control = new THREE.TransformControls( camera, renderer.domElement );
control.addEventListener( 'change', render );
control.addEventListener('mouseDown', function () {
controls.enabled = false;
});
control.addEventListener('mouseUp', function () {
controls.enabled = true;
});
//var colors = 0xFFFF44;

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

control1 = new THREE.TransformControls( camera, renderer.domElement );
control1.addEventListener( 'change', render );
control1.addEventListener('mouseDown', function () {
controls.enabled = false;

});
control1.addEventListener('mouseUp', function () {
controls.enabled = true;
});

control.attach( mesh );
scene.add( control );

});
// Label

//https://threejs.org/examples/?q=contr#webgl_materials_cars

this.setcolor = function ( colorz ) {
for (let i = scene.children.length - 1; i >= 0; i--) {
const object = scene.children[i];
if (object.type === 'Mesh'  && (object.geometry.type === 'BoxBufferGeometry' || object.geometry.type === 'SphereBufferGeometry' || object.geometry.type === 'ConeBufferGeometry') )
{
object.material.color.setHex( colorz );
}
}
}
this.setcolor_collada_texture = function () {
set_Material = function(node, material) {
node.material = material;
if (node.children) {
for (var i = 0; i < node.children.length; i++) {
set_Material(node.children[i], material);
}
}
}
for (let i = scene.children.length - 1; i >= 0; i--) {
const object = scene.children[i];
if (object.type == 'Group' )
{
var texture = THREE.ImageUtils.loadTexture( "models/cat.jpg" );
texture.repeat.set( 1, 1 );
set_Material(object, new THREE.MeshBasicMaterial({ map:texture ,side: THREE.DoubleSide}));
}
}
}
this.setcolor_collada_texture_color = function () {
set_Material = function(node, material) {
node.material = material;
if (node.children) {
for (var i = 0; i < node.children.length; i++) {
set_Material(node.children[i], material);
}
}
}
for (let i = scene.children.length - 1; i >= 0; i--) {
const object = scene.children[i];
if (object.type == 'Group' )
{
var texture = THREE.ImageUtils.loadTexture( "models/cat.jpg" );
set_Material(object, new THREE.MeshBasicMaterial({color: 0x8B4513,map:texture ,side: THREE.DoubleSide}));
}
}
}
this.setcolor_collada_color = function () {
set_Material = function(node, material) {
node.material = material;
if (node.children) {
for (var i = 0; i < node.children.length; i++) {
set_Material(node.children[i], material);
}
}
}
for (let i = scene.children.length - 1; i >= 0; i--) {
const object = scene.children[i];
if (object.type == 'Group' )
{
set_Material(object, new THREE.MeshPhongMaterial({color: 0x2ECC71}));
}
}
}
this.clear_scene1= function() {

scene.traverse ( function( child ) {


scene.removeChild( child );


} );

}
this.clear_scene= function() {
var to_remove = [];
scene.traverse ( function( child ) {
if(child)
{
// console.log(child);
}

to_remove.push( child );


} );
for ( var i = 0; i < to_remove.length; i++ ) {
if(to_remove[i])
{
//console.log(to_remove[i]);
}
scene.remove( to_remove[i] );
}
}
this.Remove_collada= function()
{

for (let i = scene.children.length - 1; i >= 0; i--) {
const object = scene.children[i];
// console.log(object);
if (object != undefined && object.type == 'Group') {
object.parent=scene;
//object.geometry.dispose();
//object.material.dispose();
//console.log(object);
// object.geometry.dispose();
//object.material.dispose();
scene.remove(object);

scene.remove( control );
scene.remove( control1 );
// mesh = undefined;
}
}

}
this.Remove_text= function()
{

for (let i = scene.children.length - 1; i >= 0; i--) {
const object = scene.children[i];

if ( object.type =="Group" && object.name !== "wolf" && object.name !== "cow" && object.name !== "cat") {
//object.parent=scene;
//object.geometry.dispose();
//object.material.dispose();
//console.log(object);
// object.geometry.dispose();
//object.material.dispose();
scene.remove(object);

//scene.remove( control );
scene.remove( control1 );
//console.log(object);
// mesh = undefined;
}
}

}

this.add_camera= function()
{



}

this.Remove_box= function()
{

for (let i = scene.children.length - 1; i >= 0; i--) {
const object = scene.children[i];
if (object.type === 'Mesh' && object.geometry.type === 'BoxBufferGeometry') {
object.geometry.dispose();
object.material.dispose();
scene.remove(object);
scene.remove( control );
mesh = undefined;
}
}

}
this.Remove_Cone= function()
{

for (let i = scene.children.length - 1; i >= 0; i--) {
const object = scene.children[i];
if (object.type === 'Mesh' && object.geometry.type === 'ConeBufferGeometry') {
object.geometry.dispose();
object.material.dispose();
scene.remove(object);
scene.remove( control );
mesh = undefined;
}
}

}
this.Remove_Sphere= function()
{

for (let i = scene.children.length - 1; i >= 0; i--) {
const object = scene.children[i];
if (object.type === 'Mesh' && object.geometry.type === 'SphereBufferGeometry') {
object.geometry.dispose();
object.material.dispose();
scene.remove(object);
scene.remove( control );
mesh = undefined;
}
}

}
this.remove_mesh = function () {
scene.remove(mesh);
scene.remove( control );
mesh = undefined;
//alert("Removed");
} ;
this.add_new_mesh = function (geo) {
var colors = 0x21fff;
var geometry = geo;
geometry.dynamic = true;
var material = new THREE.MeshPhongMaterial({color:colors, wireframe:false});
var mesh = new THREE.Mesh( geometry, material );
control.attach( mesh );
scene.add( mesh );
scene.add( control );
//alert("Added");
} ;
this.console_log= function()
{
console.log("passed");
for (let i = scene.children.length - 1; i >= 0; i--) {
var objects = scene.children[i];
if (objects.type == 'Group' && objects.type != 'PlaneGeometry') { // make it planebuffer to work

//var loader = new THREE.ColladaLoader();
//var exp = new THREE.ColladaExporter();
// var obj = new THREE.Object3D();
// obj.add( objects);
var p = {
'name' : objects.name,
'scale' : objects.scale,
'rotation' :objects.rotation,
'position':objects.position
};
console.log(JSON.stringify(p) );

/* console.log(objects.name);
console.log(objects.position);
console.log(objects.scale);
console.log(objects.rotation);
console.log(objects.textures);*/
//console.log(JSON.stringify(objects.scale));
// expected output: "{"x":5,"y":6}"
//var {data} = exp.parse( obj, { textureDirectory: 'textures/' } );
//  console.log('Format', data);

}
}

};



window.addEventListener( 'keydown', function ( event ) {
switch ( event.keyCode ) {
case 81: // Q
control.setSpace( control.space === "local" ? "world" : "local" );
break;
case 17: // Ctrl
control.setTranslationSnap( 100 );
control.setRotationSnap( THREE.Math.degToRad( 15 ) );
break;
case 87: // W
control.setMode( "translate" );
//cube.material.color.setHex( 0xffffff );

break;
case 69: // E
control.setMode( "rotate" );
var colors = 0xFFFF44;
break;
case 82: // R
control.setMode( "scale" );
break;
case 187:
/*case 107: // +, =, num+
control.setSize( control.size + 0.001 );
break;*/
case 189:
/* case 109: // -, _, num-
control.setSize( Math.max( control.size - 0.1, 0.1 ) );
break;*/
}
});
//mesh.material.color.setHex( 0xf56fff );
// STATS
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '0px';
stats.domElement.style.zIndex = 100;
container.appendChild( stats.domElement );
// LIGHT
var light = new THREE.PointLight(0xffffff);
light.position.set(-100,150,100);
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
scene.add( directionalLight );
var light1 = new THREE.DirectionalLight( 0xffffff, 0.2 );
light1.position.set( 1, 1, 1 );
scene.add( light1 );
var light1 = new THREE.DirectionalLight( 0xffffff, 0.2 );
light1.position.set( 0, 1, 1 );
scene.add( light1 );
var light1 = new THREE.DirectionalLight( 0xffffff, 0.2 );
light1.position.set( 1, 0, 1 );
scene.add( light1 );
var light1 = new THREE.DirectionalLight( 0xffffff, 0.2 );
light1.position.set( 0, 0, 1 );
scene.add( light1 );

/*        labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = 0;
document.body.appendChild( labelRenderer.domElement );
var moonDiv = document.createElement( 'div' );
moonDiv.className = 'label';
moonDiv.textContent = 'Moon00000000000000000000000';
moonDiv.style.marginTop = '-1em';
var moonLabel = new THREE.CSS2DObject( moonDiv );
moonLabel.position.set( 0, -20, 0 );
scene.add( moonLabel );*/
/*var lightbulbGeometry = new THREE.SphereGeometry( 10, 16, 8 );
var lightbulbMaterial = new THREE.MeshBasicMaterial( { color: 0xffff44, transparent: true,  opacity: 0.8, blending: THREE.AdditiveBlending } );
var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
var materialArray = [lightbulbMaterial, wireMaterial];
var lightbulb = THREE.SceneUtils.createMultiMaterialObject( lightbulbGeometry, materialArray );
// var lightbulb = new THREE.Mesh( lightbulbGeometry, lightbulbMaterial );
lightbulb.position = light.position;
// lightbulb.material.;
scene.add(lightbulb);*/
scene.add(light);
// FLOOR
var floorTexture = new THREE.ImageUtils.loadTexture( 'images/download.png' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 1, 1 );
var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.5;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
// SKYBOX/FOG
var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
//var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
var skyBoxMaterial =
[
new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('images/1/alien_ft.JPG'),side :THREE.DoubleSide}), //right
new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('images/1/alien_bk.JPG'),side :THREE.DoubleSide}), //left
new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('images/1/alien_up.JPG'),side :THREE.DoubleSide}),//top
new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('images/1/alien_dn.JPG'),side :THREE.DoubleSide}),//bottom
new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('images/1/alien_rt.JPG'),side :THREE.DoubleSide}),//front
new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('images/1/alien_lf.JPG'),side :THREE.DoubleSide})//back
] ;
var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
scene.add(skyBox);
//scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

////////////
// CUSTOM //
////////////
/*var cubeGeometry = new THREE.CubeGeometry( 50, 50, 50 );
var cubeMaterial = new THREE.MeshPhongMaterial( { color:0xff0000, transparent:true, opacity:1 } );
cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
cube.position.set(0,30,0);
scene.add(cube);*/
var axes = new THREE.AxisHelper();
scene.add(axes);



}

function alertMessage( message )
{
alert( message );
}
function animate()
{
requestAnimationFrame( animate );
render();
update();
}
function update()
{
if ( keyboard.pressed("z") )
{
// do something
}


//
//controls.update();
stats.update();
}
function render()
{
renderer.render( scene, camera );
// labelRenderer.render( scene, camera );
}
/*group = new THREE.Object3D();//create an empty container
group.add( cube );//add a mesh with geometry to it
Scene.add( group );//when done, add the group to the scene

var obj = new THREE.Object3D();
var loader = new THREE.ColladaLoader();
var exp = new THREE.ColladaExporter();
//obj.add(mesh1);
//obj.add(mesh2);
var { data } = exp.parse(group);
console.log('Format', data);*/