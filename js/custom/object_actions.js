 document.getElementById("move").addEventListener("click", Move);
 document.getElementById("rotate").addEventListener("click",Rotate );
 document.getElementById("size").addEventListener("click", Size);

function Move() {
  control.setMode( "translate" );
 
  //control.setTranslationSnap( 100 );
 // control.setRotationSnap( THREE.Math.degToRad( 15 ) );
}
function Size() {
  control.setMode( "scale" );
 

}
function Rotate() {
  control.setMode( "rotate" );
  
}


