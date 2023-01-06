import * as THREE from './build/three.module.js';
import { PLYLoader } from './jsm/PLYLoader.js';
import { OrbitControls } from './jsm/OrbitControls.js';
import { WEBGL } from './jsm/WebGL.js';
import { GUI } from 'https://threejsfundamentals.org/3rdparty/dat.gui.module.js';
import { create_threejs_objects, add_threejs_objects_to_scene, init_gui } from '/mesh_initializer.js';


if ( WEBGL.isWebGL2Available() === false ) {

  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );

}


let container, progress_container, container2;

let camera, control, scene, renderer, w, h;


init();
animate();


function init() {
  
  container = document.getElementById( 'canvas' );
  renderer = new THREE.WebGLRenderer();

  
  w = container.offsetWidth;
  h = container.offsetHeight;

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( w, h );
  container.appendChild(renderer.domElement);

  // gui
  var gui = new GUI({autoPlace: false, width: 220});
  container2 = document.getElementById( 'gui' );
  container2.appendChild(gui.domElement);
  fetch('nodes.json')
  .then(response => {return response.json();})
  .then(json_response => {console.log(json_response); return json_response})
  .then(json_response => create_threejs_objects(json_response, render, scene))
  .then(() => add_threejs_objects_to_scene(scene))
  .then(() => init_gui(gui, render))
  .then(() => console.log('done'));

  camera = new THREE.PerspectiveCamera( 45, w / h, 0.001, 2000 );
	// camera.position.set(1.6812, -1.5227, -1.8727);
	camera.position.set(1.6395, -1.6695, -1.9060);
  camera.up.set(0, -1, 0);

  control = new OrbitControls( camera, renderer.domElement );

  // scene
  scene = new THREE.Scene();
  scene.background =  new THREE.Color( 0xffffff );

  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.7 );
  scene.add( ambientLight );

  const pointLight = new THREE.PointLight( 0xffffff, 0.6 );
  camera.add( pointLight );
  scene.add( camera );
  
  // camera setting
  // camera.rotation.x = 2.8633;
  // camera.rotation.y = 0.9479;
  // camera.rotation.z = 0.2279;
  camera.rotation.x = 2.8569;
  camera.rotation.y = 1.0158;
  camera.rotation.z = 0.2437;
	camera.updateProjectionMatrix();


  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove );

  //

  window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  control.update();

}

function onDocumentMouseMove( event ) {

}

//

function animate() {
  requestAnimationFrame( animate );
  render();

}

function render() {

  renderer.render( scene, camera );
  // console.log(camera.position)
  // console.log(camera.rotation)
    
}

function onTransitionEnd( event ) {

  event.target.remove();

}
