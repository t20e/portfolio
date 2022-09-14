import "./styles/main.scss";
import * as THREE from "three";
import { Group, LoadingManager, AnimationMixer, AnimationClip, Clock } from "three";
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
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

let scene, cssScene, camera, renderer, cssRenderer, controls, clock, mixer;
let player = { height: 1.8 };
let USE_WIREFRAME = true;
let vid_texture;


const material = new THREE.MeshBasicMaterial({ wireframe: USE_WIREFRAME, wireframeLinewidth: 1, side: THREE.DoubleSide });
// const material = new THREE.MeshBasicMaterial({ color: 0x69934, wireframe: USE_WIREFRAME, wireframeLinewidth: 1, side: THREE.FrontSide });
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
    cssScene = new THREE.Scene();
    clock = new THREE.Clock();
    // const addScreen = new THREE.Group()
    // addScreen.add(new screensRender('99', 0, 0, 240, 0))
    // cssScene.add(addScreen);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.color.setHSL(0.2, .2, 0.1);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 2, 0);
    scene.add(hemiLight);

    const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 2);
    // scene.add(hemiLightHelper);


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // renderer.setClearColor(0x000000, 0); // the default
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.shadowMap.enabled = true;
    renderer.domElement.setAttribute('id', 'renderer');
    document.body.appendChild(renderer.domElement)

    // cssRenderer = new CSS3DRenderer()
    // cssRenderer.setSize(window.innerWidth, window.innerHeight);
    // cssRenderer.domElement.style.height = '300px';
    // cssRenderer.domElement.style.width = '250px';
    // cssRenderer.domElement.setAttribute('id', 'cssRenderer')
    // // const div = document.createElement('div');
    // // div.style.backgroundColor = 'blue';
    // // div.style.position = 'absolute';
    // // div.style.top = '0px';
    // // div.style.right = '0px';
    // // div.height = '100px';
    // // div.width = '100px';
    // // let object = new CSS3DObject(div);
    // // cssScene.add(object);
    // document.body.appendChild(cssRenderer.domElement);


    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    // camera.position.y = 3;
    camera.position.z -= 0.01;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.rotateSpeed = - 0.30;
    controls.enablePan = false;

    scene.add(camera);
    loadModels()
    screensRender("screen_one", 0.745769 , -0.332765, -3.57589 , -0.349066)
    screensRender("screen_two", -0.72123, -0.332765, -3.59841, 0.349066)

    // axe helper
    const axesHelper = new AxesHelper(10);


    window.addEventListener('resize', onWindowResize);
    // controls for drag and scroll
    document.addEventListener('wheel', onMouseWheel);
    camera.rotation.y = 90;
    animate();
};

const animate = () => {
    // this loops to create frames
    requestAnimationFrame(animate);
    // update video texture
    // vid_texture.needsUpdate = true;
    renderer.render(scene, camera);
    // cssRenderer.render(cssScene, camera);
};

const loadModels = () => {
    gltfLoader.load(scene_import, (gltf) => {
        gltf.scene.traverse((c) => {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        scene.add(gltf.scene);
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
// id, pos(xyz), roation.y
const screensRender = (id, x, y, z, rotateY) => {
    let screen = document.getElementById(id)
    // console.log(screen_one)
    // screen.load()
    screen.play()
    vid_texture = new THREE.VideoTexture(screen)
    vid_texture.minFilter = THREE.LinearFilter;
    vid_texture.magFilter = THREE.LinearFilter;

    let vidMaterial = new THREE.MeshBasicMaterial({
        map: vid_texture, //set material Property to video texture
        side: THREE.FrontSide, //show vid on front side
        toneMapped: false // turn off tone mapping
    })
    let pos = new THREE.Vector3(x, y, z)

    const geometry = new THREE.PlaneGeometry(1.19775, 0.749114);
    const screen_mesh = new THREE.Mesh(geometry, vidMaterial);
    screen_mesh.position.copy(pos);
    // screen_mesh.position.set(.5, .5, .5)
    screen_mesh.rotation.y = rotateY
    // screen_mesh.rotation.copy(object.rotation);
    // screen_mesh.scale.copy(object.scale);
    scene.add(screen_mesh);
}

const onMouseWheel = (e) => {
    const fov = camera.fov + e.deltaY * 0.05;
    // console.log((fov));
    camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
}
const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
}

init();

