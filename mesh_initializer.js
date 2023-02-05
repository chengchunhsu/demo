import * as THREE from 'three';
import { OBJLoader } from './jsm/OBJLoader.js';


// dict containing all objects of the scene
let threejs_objects = {};
let threejs_objects_state = {};
let threejs_objects_joint_type = {};
let threejs_objects_screw_point = {};
let threejs_objects_screw_axis = {};
let threejs_objects_state_obj = {};
let threejs_objects_state_factor = {};


function get_obj(properties){
	var container = new THREE.Object3D();

	// const loader = new GLTFLoader();
	// loader.load( 'https://media.githubusercontent.com/media/chengchunhsu/demo/main/data/meshes/' + properties['filename'].replace(".obj", ".gltf"), function ( gltf ) {
	// 	gltf.scene.traverse( function( node ) {
	// 		if( node.material ) {
	// 			node.material.side = THREE.DoubleSide;
	// 		}
	// 	});
		
	// 	gltf.scene.translateX(properties['translation'][0])
	// 	gltf.scene.translateY(properties['translation'][1])
	// 	gltf.scene.translateZ(properties['translation'][2])

	// 	const q = new THREE.Quaternion(
	// 		properties['rotation'][1],
	// 		properties['rotation'][2],
	// 		properties['rotation'][3],
	// 		properties['rotation'][0])
	// 	gltf.scene.setRotationFromQuaternion(q)

	// 	gltf.scene.scale.set(properties['scale'][0], properties['scale'][1], properties['scale'][2])

	// 	container.add( gltf.scene );
	// } );

	const loader = new OBJLoader();
	loader.load( 'https://media.githubusercontent.com/media/chengchunhsu/demo/main/data/meshes/' + properties['filename'], function ( object ) {

        object.traverse( function( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.side = THREE.DoubleSide;
            }
        } );
        object.receiveShadow = false;
        object.castShadow = false;

		object.translateX(properties['translation'][0])
		object.translateY(properties['translation'][1])
		object.translateZ(properties['translation'][2])

		const q = new THREE.Quaternion(
			properties['rotation'][1],
			properties['rotation'][2],
			properties['rotation'][3],
			properties['rotation'][0])
			object.setRotationFromQuaternion(q)

			object.scale.set(properties['scale'][0], properties['scale'][1], properties['scale'][2])
		
		container.add(object);
	});
	

	return container
}



export function create_threejs_objects(properties, render, scene){

	for (const [object_name, object_properties] of Object.entries(properties)) {

		if (String(object_properties['type']).localeCompare('obj') == 0){
			
			threejs_objects[object_name] = get_obj(object_properties);

			threejs_objects_state[object_name] = {}
			threejs_objects_state[object_name].state = true;
			threejs_objects_state[object_name].changeState = 
				function() {
					var object = scene.getObjectByName(object_name);
					let joint_type = threejs_objects_joint_type[object_name];
					let screw_point = threejs_objects_screw_point[object_name];
					let screw_axis = threejs_objects_screw_axis[object_name];
					let state_obj = threejs_objects_state_obj[object_name];          
					let state_factor = threejs_objects_state_factor[object_name];

					if (threejs_objects_state[object_name].state == false){
						if (joint_type == 0){
							if (object_name.includes('washer')){
								object.rotateAroundWorldAxis(new THREE.Vector3(screw_point[0], screw_point[1], screw_point[2]), new THREE.Vector3(screw_axis[0], screw_axis[1], screw_axis[2]), -Math.PI / 2 * 0.33 * state_factor);
							}
							else if (object_name.includes('bottom_cabinet_no_top_17')){
								object.rotateAroundWorldAxis(new THREE.Vector3(screw_point[0], screw_point[1], screw_point[2]), new THREE.Vector3(screw_axis[0], screw_axis[1], screw_axis[2]), -Math.PI / 2 * 1.33);
							}
							else {
								object.rotateAroundWorldAxis(new THREE.Vector3(screw_point[0], screw_point[1], screw_point[2]), new THREE.Vector3(screw_axis[0], screw_axis[1], screw_axis[2]), -Math.PI / 2 * state_factor);
							}
						} else if (joint_type == 1) {
							object.translateOnAxis(new THREE.Vector3(screw_axis[0], screw_axis[1], screw_axis[2]), -state_obj)
						}
						threejs_objects_state[object_name].state = true
					}
					else {
						if (joint_type == 0){
							if (object_name.includes('washer')){
								object.rotateAroundWorldAxis(new THREE.Vector3(screw_point[0], screw_point[1], screw_point[2]), new THREE.Vector3(screw_axis[0], screw_axis[1], screw_axis[2]), Math.PI / 2 * 0.33 * state_factor);
							}
							else if (object_name.includes('bottom_cabinet_no_top_17')){
								object.rotateAroundWorldAxis(new THREE.Vector3(screw_point[0], screw_point[1], screw_point[2]), new THREE.Vector3(screw_axis[0], screw_axis[1], screw_axis[2]), Math.PI / 2 * 1.33);
							}
							else {
								object.rotateAroundWorldAxis(new THREE.Vector3(screw_point[0], screw_point[1], screw_point[2]), new THREE.Vector3(screw_axis[0], screw_axis[1], screw_axis[2]), Math.PI / 2 * state_factor);
							}
						} else if (joint_type == 1) {
							object.translateOnAxis(new THREE.Vector3(screw_axis[0], screw_axis[1], screw_axis[2]), state_obj)
						}
						threejs_objects_state[object_name].state = false
					}
				};
			
			threejs_objects_joint_type[object_name] = object_properties['joint_type'];
			threejs_objects_screw_point[object_name] = object_properties['screw_point'];
			threejs_objects_screw_axis[object_name] = object_properties['screw_axis'];
			threejs_objects_state_obj[object_name] = object_properties['state_obj'];
			threejs_objects_state_factor[object_name] = object_properties['state_factor'];


		
		}
	}
	render();
}

export function add_threejs_objects_to_scene(scene){
	for (const [key, value] of Object.entries(threejs_objects)) {
		value.name = key
		scene.add(value);
	}
}

export function init_gui(gui, render){

	let menuMap = new Map();

	for (const [name, value] of Object.entries(threejs_objects)){
		let splits = name.split(';')
		if (splits.length > 1) {
			let folder_name = splits[0];
			if (!menuMap.has(folder_name)) {
				menuMap.set(folder_name, gui.addFolder(folder_name));
			}
			let fol = menuMap.get(folder_name);
			fol.add(value, 'visible').name(splits[1]).onChange(render);
			fol.open();

		} else {
			var obj_name = name
			if (obj_name !== 'static_scene') {
				gui.add(threejs_objects_state[obj_name], 'changeState').name(
					// obj_name.replace("Benevolence_1_int_kitchen_0_3 ", "")
					obj_name.replace('Benevolence_1_int_kitchen_0_3 bottom_cabinet_no_top_16 1', 'Cabinet-1 (down)')
					.replace('Benevolence_1_int_kitchen_0_3 bottom_cabinet_no_top_16 2', 'Cabinet-1 (right)')
					.replace('Benevolence_1_int_kitchen_0_3 bottom_cabinet_no_top_16 3', 'Cabinet-1 (left)')
					.replace('Benevolence_1_int_kitchen_0_3 bottom_cabinet_no_top_17 0', 'Cabinet-2')
					.replace('Benevolence_1_int_kitchen_0_3 bottom_cabinet_no_top_22 1', 'Cabinet-3')
					.replace('Benevolence_1_int_kitchen_0_3 dishwasher_20 0', 'Dishwasher')
					.replace('Benevolence_1_int_kitchen_0_3 fridge_27 0', 'Fridge (top)')
					.replace('Benevolence_1_int_kitchen_0_3 fridge_27 1', 'Fridge (down)')
					.trim()
				).onChange(render);
			}
		}
		
		threejs_objects_state[name].changeState() // close all doors
	}
}

THREE.Object3D.prototype.rotateAroundWorldAxis = function() {

    // rotate object around axis in world space (the axis passes through point)
    // axis is assumed to be normalized
    // assumes object does not have a rotated parent

    var q = new THREE.Quaternion();

    return function rotateAroundWorldAxis( point, axis, angle ) {

        q.setFromAxisAngle( axis, angle );

        this.applyQuaternion( q );

        this.position.sub( point );
        this.position.applyQuaternion( q );
        this.position.add( point );

        return this;

    }

}();