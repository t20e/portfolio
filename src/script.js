import "./styles/main.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
// import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { AxesHelper } from "three/src/helpers/AxesHelper.js";
import arid2_ft from "./assets/arid2_ft.jpg";
import arid2_bk from "./assets/arid2_bk.jpg";
import arid2_up from "./assets/arid2_up.jpg";
import arid2_dn from "./assets/arid2_dn.jpg";
import arid2_rt from "./assets/arid2_rt.jpg";
import arid2_lf from "./assets/arid2_lf.jpg";
import satoshi_light from "./assets/satoshi_light_regular.json";
import { loadModels } from "./loadModels.js"
import { mergeWithRules } from "webpack-merge";
let scene, camera, renderer, controls, clock;
let meshFloor, wall1, wall2, wall3, wall4;
let player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
let USE_WIREFRAME = false;
// move position
// let {xPosition, yPosition, zPosition} = 0;
// let oldX, oldY, oldZ;

// let isUserInteracting = false,
//     onPointerDownMouseX = 0, onPointerDownMouseY = 0,
//     lon = 0, onPointerDownLon = 0,
//     lat = 0, onPointerDownLat = 0

let yawDir, pitchDir, lookAt;
// yaw is the horizontal view, pitch is the vertical
const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("whiteSmoke");
    // scene.add(new THREE.AmbientLight("white", 1));
    // const light1 = new THREE.PointLight(0x33ff33, 1, 100)
    // light1.castShadow = true;
    // light1.shadow.mapSize.width = 4096
    // light1.shadow.mapSize.height = 4096
    // scene.add(light1)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(15, 20, 0);
    scene.add(hemiLight);

    const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    scene.add(hemiLightHelper);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    // camera = new THREE.PerspectiveCamera(
    //     90,
    //     window.innerWidth / window.innerHeight,
    //     0.1,
    //     10000
    // );
    
    
    
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));
    // camera.position.y = 2;
    camera.position.z = 0.01;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.rotateSpeed = - 0.30;
    controls.enablePan = false;
    scene.add(camera);
    // TODO first person controls
    // TODO let user know for best experience to be in fullscreen mode
    // controls = new FirstPersonControls(camera, renderer.domElement);
    // // turn first person controls on
    // controls.enabled = true;
    // // which way the camera can look
    // controls.activeLook = true;
    // controls.lookVertical = true;
    // // limit how far a user can look in directions
    // controls.constrainVertical = true;
    // controls.verticalMax = Math.PI / 2.3;
    // controls.verticalMin = Math.PI / 1.7;
    // controls.lookSpeed = .002


    // other controls
    // controls = new PointerLockControls(camera, document.body);
    // controls.unlock();
    // document.addEventListener(controls, ()=>{
    //     console.log("hi")
    // })
    // document.addEventListener('mousemove', (e) => {
    //     console.log('hi')
    //     // camera.rotation.y += .01
    // })




    // axe helper
    const axesHelper = new AxesHelper(20);
    scene.add(axesHelper);
    // box
    // mesh = new THREE.Mesh(
    //     new THREE.BoxGeometry(1, 1, 1),
    //     new THREE.MeshBasicMaterial({ color: 0xff4444, wireframe: USE_WIREFRAME })
    // );
    // mesh.position.y += 1; // Move the mesh up 1 meter
    // scene.add(mesh);
    // floor
    // meshFloor = new THREE.Mesh(
    //     new THREE.PlaneGeometry(10, 10, 10, 10),
    //     new THREE.MeshBasicMaterial({ color: 'darkBlue', wireframe: USE_WIREFRAME })
    // );
    // meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
    // meshFloor.position.y = 0
    // meshFloor.receiveShadow = true;
    // scene.add(meshFloor);
    // const addWalls = (color, x, y, z) => {
    //     let wall = new THREE.Mesh(
    //         new THREE.PlaneGeometry(10, 5),
    //         // the side: THREE.DoubleSide lets both sides show
    //         new THREE.MeshBasicMaterial({
    //             color: color,
    //             wireframe: USE_WIREFRAME,
    //             side: THREE.DoubleSide,
    //         })
    //     );
    //     wall.position.x = x;
    //     wall.position.y = y[0];
    //     wall.position.z = z;
    //     if (y[1]) {
    //         wall.rotation.y = Math.PI / 2;
    //     }
    //     scene.add(wall);
    // }
    // addWalls("purple", 0, [2.5], -5)
    // wall1 = new THREE.Mesh(
    //     new THREE.PlaneGeometry(10, 5),
    //     // the side: THREE.DoubleSide lets both sides show
    //     new THREE.MeshBasicMaterial({
    //         color: "purple",
    //         wireframe: USE_WIREFRAME,
    //         side: THREE.DoubleSide,
    //     })
    // );
    // wall1.position.y = 2.5;
    // wall1.position.z = -5;
    // scene.add(wall1);
    // addWalls("orange", 0, [2.5], 5)
    // wall2 = new THREE.Mesh(
    //     new THREE.PlaneGeometry(10, 5),
    //     // the side: THREE.DoubleSide lets both sides show
    //     new THREE.MeshBasicMaterial({
    //         color: "orange",
    //         wireframe: USE_WIREFRAME,
    //         side: THREE.DoubleSide,
    //     })
    // );
    // wall2.position.y = 2.5;
    // wall2.position.z = 5;
    // scene.add(wall2);
    // addWalls("brown", 5, [2.5, Math.PI / 2], 0)
    // wall3 = new THREE.Mesh(
    //     new THREE.PlaneGeometry(10, 5),
    //     // the side: THREE.DoubleSide lets both sides show
    //     new THREE.MeshBasicMaterial({
    //         color: "brown",
    //         wireframe: USE_WIREFRAME,
    //         side: THREE.DoubleSide,
    //     })
    // );
    // wall3.position.y = 2.5;
    // wall3.position.x = 5;
    // wall3.rotation.y = Math.PI / 2;
    // scene.add(wall3);
    // addWalls("grey", -5, [2.5, Math.PI / 2], 0)
    // wall4 = new THREE.Mesh(
    //     new THREE.PlaneGeometry(10, 5),
    //     // the side: THREE.DoubleSide lets both sides show
    //     new THREE.MeshBasicMaterial({
    //         color: "grey",
    //         wireframe: USE_WIREFRAME,
    //         side: THREE.DoubleSide,
    //     })
    // );
    // wall4.position.x = -5;
    // wall4.position.y = 2.5;
    // wall4.rotation.y = Math.PI / 2;
    // scene.add(wall4);


    loadModels(scene)
    // text loader
    const textLoader = new FontLoader();
    textLoader.load(satoshi_light), (font) => {
        const geometry = new TextGeometry("hi how are you", {
            font: font,
            size: 20,
            height: 20,
        })
        const textMesh = new THREE.Mesh(geometry, [
            new THREE.MeshPhongMaterial({ color: 0x2028 }), //front
            new THREE.MeshPhongMaterial({ color: 0x58A }), //side
        ]);
        // text mesh
        textMesh.castShadow = true;
        textMesh.set(0, 0, 0)
        scene.add(textMesh);
    }
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    // controls for drag and scroll
    document.addEventListener('wheel', onMouseWheel);
    // document.addEventListener( 'pointerdown', onPointerDown );
    // document.addEventListener('dragover', function (e) {
    //     e.preventDefault();
    //     e.dataTransfer.dropEffect = 'copy';
    // });
    // document.addEventListener( 'dragenter', function () {
    //     document.body.style.opacity = 0.5;
    // } );
    // document.addEventListener( 'dragleave', function () {
    //     document.body.style.opacity = 1;
    // } );
    // document.addEventListener( 'mousemove', onMouseMove)
    animate();
};

const animate = () => {
    // this loops to create frames
    requestAnimationFrame(animate);
    // update controls every frame  for first person
    // controls.update(0.3)

    renderer.render(scene, camera);
};



// const onPointerDown = (e) => {

//     if (e.isPrimary === false) return;
//     isUserInteracting = true;
//     onPointerDownMouseX = e.clientX;
//     onPointerDownMouseY = e.clientY;
//     onPointerDownLon = lon;
//     onPointerDownLat = lat;
//     document.addEventListener('pointermove', onPointerMove);
//     document.addEventListener('pointerup', onPointerUp);

// }

// const onPointerMove = (e) => {
//     if (e.isPrimary === false) return;
//     lon = (onPointerDownMouseX - e.clientX) * 0.1 + onPointerDownLon;
//     lat = (e.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;

// }

// const onPointerUp = (e) => {
//     if (e.isPrimary === false) return;
//     isUserInteracting = false;
//     document.removeEventListener('pointermove', onPointerMove);
//     document.removeEventListener('pointerup', onPointerUp);

// }
const onMouseWheel = (e) => {
    const fov = camera.fov + e.deltaY * 0.05;
    // console.log((fov));
    camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
}
const onWindowResize = () => {
    // for first person controls handle window resize
    controls.handleResize();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
init();

// OLDER WITH CUBE MAPPING BUT I COULD NOT GET THE TEXTS TO APPEAR INSIDE

// const init = () => {
//     scene = new THREE.Scene();
//     scene.background = new THREE.Color(255, 255, 255);

//     camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
//     camera.position.y = 0;
//     clock = new THREE.Clock();
//     renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     document.body.appendChild(renderer.domElement);
//     // create a plane mesh to be a group object that light will cast on
//     const plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshPhongMaterial({ color: 0xffff00 }));
//     plane.rotation.x = - Math.PI / 2
//     plane.receiveShadow = true;
//     plane.position.z = 0;
//     scene.add(plane);
//     camera.lookAt(plane.position);

//     scene.add(new THREE.AmbientLight(0xffffff, .05));
//     const light1 = new THREE.PointLight(0x33ff33, 1, 100)
//     light1.castShadow = true;
//     light1.shadow.mapSize.width = 4096
//     light1.shadow.mapSize.height = 4096
//     scene.add(light1)


//     controls = new FirstPersonControls(camera, renderer.domElement);
//     controls.movementSpeed = 500;
//     controls.lookSpeed = 0.8;
//     controls.movementSpeed = 0.2;
//     // controls.addEventListener('change', renderer);
//     // controls.minDistance = 500;
//     // controls.maxDistance = 1000;
//     // controls.enablePan = false;
//     let materialArr = [];
//     // load the images as texture
//     let texture_ft = new THREE.TextureLoader().load(arid2_ft);
//     let texture_bk = new THREE.TextureLoader().load(arid2_bk);
//     let texture_up = new THREE.TextureLoader().load(arid2_up);
//     let texture_dn = new THREE.TextureLoader().load(arid2_dn);
//     let texture_rt = new THREE.TextureLoader().load(arid2_rt);
//     let texture_lf = new THREE.TextureLoader().load(arid2_lf);

//     materialArr.push(new THREE.MeshBasicMaterial({ map: texture_ft }))
//     materialArr.push(new THREE.MeshBasicMaterial({ map: texture_bk }))
//     materialArr.push(new THREE.MeshBasicMaterial({ map: texture_up }))
//     materialArr.push(new THREE.MeshBasicMaterial({ map: texture_dn }))
//     materialArr.push(new THREE.MeshBasicMaterial({ map: texture_rt }))
//     materialArr.push(new THREE.MeshBasicMaterial({ map: texture_lf }))
//     // this will make it so the texture is applied to the outside instead of on the cubemap
//     for (let i = 0; i < 6; i++) {
//         materialArr[i].side = THREE.BackSide;
//     }

//     let skyBoxGeo = new THREE.BoxGeometry(10000, 10000, 10000)
//     let skyBox = new THREE.Mesh(skyBoxGeo, materialArr)

//     scene.add(skyBox)
//     // text loader
//     const loader = new FontLoader();
//     loader.load(satoshi_light), (font) => {
//         const geometry = new TextGeometry("hi how are you", {
//             font: font,
//             size: 20,
//             height: 20,
//         })
//         const textMesh = new THREE.Mesh(geometry, [
//             new THREE.MeshPhongMaterial({ color: 0xffff }), //front
//             new THREE.MeshPhongMaterial({ color: 0xffff }), //side
//         ]);
//         // text mesh
//         textMesh.castShadow = true;
//         textMesh.set(0, 0, 0)
//         scene.add(textMesh);
//     }
//     animate();
// }
// const animate = () => {
//     // loops through pixel to animate
//     // const delta = Clock.getDelta();
//     // const time = clock.getElapsedTime() * 10;
//     // const position = geometry.attributes.position;

//     // for (let i = 0; i < position.count; i++) {

//     //     const y = 35 * Math.sin(i / 5 + (time + i) / 7);
//     //     position.setY(i, y);

//     // }
//     // position.needsUpdate = true;
//     // controls.update(delta);
//     renderer.render(scene, camera);
//     requestAnimationFrame(animate);
// }
// init();
