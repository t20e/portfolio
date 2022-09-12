import "./styles/main.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AxesHelper } from "three/src/helpers/AxesHelper.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import satoshi_light from "./assets/satoshi_light_regular.json";
import rainbow_ft from "./assets/rainbow_ft.png";
import rainbow_bk from "./assets/rainbow_bk.png";
import rainbow_up from "./assets/rainbow_up.png";
import rainbow_dn from "./assets/rainbow_dn.png";
import rainbow_rt from "./assets/rainbow_rt.png";
import rainbow_lf from "./assets/rainbow_lf.png";
import scene_import from "./assets/models/scene.gltf"
import { LoadingManager } from "three";
import { AnimationMixer } from "three";
import { AnimationClip } from "three";
import {Clock} from "three";
import {CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import {CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer.js"


let scene, camera, renderer, controls, clock;
let mixer = null
let player = { height: 1.8 };
let USE_WIREFRAME = false;

const loadManager = new LoadingManager()
// passing in the loadManager to every instance of a loader such as GLTFLoader etc,
// gltf loader
loadManager.onStart = (url, item, total) => {
    console.log(url, item, total);
    console.log('start loading')
}
// loadManager.onProgress = (url, loaded, total)=>{
//     console.log(url, loaded, total);
//     console.log('progress loading')
// }
loadManager.onLoad = () => {
    console.log('finished loading')
}
loadManager.onError = (url) => {
    console.log('err loading file =>', url)
}
const gltfLoader = new GLTFLoader(loadManager);

const init = () => {
    scene = new THREE.Scene();


    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.color.setHSL(0.2, .2, 0.1);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 2, 0);
    scene.add(hemiLight);

    const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 2);
    scene.add(hemiLightHelper);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer = new CSS3DRenderer({antialias:true})
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;


    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));
    // camera.position.y = 2;
    camera.position.z -= 0.01;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.rotateSpeed = - 0.30;
    controls.enablePan = false;

    scene.add(camera);


    // axe helper
    // const axesHelper = new AxesHelper(20);
    // scene.add(axesHelper);
    //FIXME finish this
    const overlay = document.createElement("div");
    overlay.innerHTML = "<h1> hello css </h1>"
    let obj = new CSS3DObject(overlay)
    obj.position.set(0,0,0)
    scene.add(obj);

    document.body.appendChild(renderer.domElement)
    window.addEventListener('resize', onWindowResize);
    // controls for drag and scroll
    document.addEventListener('wheel', onMouseWheel);
    
    loadModels()
    animate();
};

const animate = () => {
    // this loops to create frames
    requestAnimationFrame(animate);
    // update animation 
    // mixer !== null? mixer.update(): null
    renderer.render(scene, camera);
};

const loadModels = () => {
    // gltfLoader.load(tv_station, (gltf) => {
    //     gltf.scene.traverse((c) => {
    //         c.castShadow = true;
    //         c.receiveShadow = true;
    //         c.position.z = 0
    //         c.position.y = .23
    //         // c.scale.set(.18, .18, .18)
    //     });
    //     scene.add(gltf.scene);
    // });


    gltfLoader.load(scene_import, (gltf) => {
        gltf.scene.traverse((c) => {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        scene.add(gltf.scene);
        mixer = new AnimationMixer(gltf.scene);
        const clips = gltf.animations;
        const clip = AnimationClip.findByName(clips, 'HeadAction');
        const action = mixer.clipAction(clip);
        // action.play()
    });

    let materialArr = [];
    // load the images as texture
    let texture_ft = new THREE.TextureLoader().load(rainbow_ft);
    let texture_bk = new THREE.TextureLoader().load(rainbow_bk);
    let texture_up = new THREE.TextureLoader().load(rainbow_up);
    let texture_dn = new THREE.TextureLoader().load(rainbow_dn);
    let texture_rt = new THREE.TextureLoader().load(rainbow_rt);
    let texture_lf = new THREE.TextureLoader().load(rainbow_lf);

    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_ft }))
    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_bk }))
    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_up }))
    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_dn }))
    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_rt }))
    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_lf }))
    // this will make it so the texture is applied to the outside instead of on the cubemap
    for (let i = 0; i < 6; i++) {
        materialArr[i].side = THREE.BackSide;
    }

    let skyBoxGeo = new THREE.BoxGeometry(10, 10, 10)
    let skyBox = new THREE.Mesh(skyBoxGeo, materialArr)
    skyBox.position.y = 1
    scene.add(skyBox)
}

const onMouseWheel = (e) => {
    const fov = camera.fov + e.deltaY * 0.05;
    // console.log((fov));
    camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
}
const onWindowResize = () => {
    // for first person controls handle window resize
    // controls.handleResize();
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
}

init();

