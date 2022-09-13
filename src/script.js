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
let vidOne_Texture;


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

    cssRenderer = new CSS3DRenderer()
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = 0;
    cssRenderer.domElement.style.height = '200px';
    cssRenderer.domElement.style.width = '200px';
    cssRenderer.domElement.setAttribute('id', 'cssRenderer')
    document.body.appendChild(cssRenderer.domElement);


    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));
    camera.position.y = 3;
    camera.position.z -= 0.01;

    controls = new OrbitControls(camera, renderer.domElement, cssRenderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.rotateSpeed = - 0.30;
    controls.enablePan = false;

    scene.add(camera);
    // loadModels()
    screensRender()

    // axe helper
    const axesHelper = new AxesHelper(10);
    // scene.add(axesHelper);
    //FIXME finish this
    // const overlay = document.createElement("div");
    // overlay.innerHTML = "<h1> hello css </h1>"
    // let obj = new CSS3DObject(overlay)
    // obj.position.set(0, 0, 0)
    // scene.add(obj);

    window.addEventListener('resize', onWindowResize);
    // controls for drag and scroll
    document.addEventListener('wheel', onMouseWheel);


    animate();
};

const animate = () => {
    // this loops to create frames
    requestAnimationFrame(animate);
    // update video texture
    // vidOne_Texture.needsUpdate = true;
    renderer.render(scene, camera);
    cssRenderer.render(cssScene, camera);
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
const screensRender = () => {
    // let screenOne = document.getElementById("screen_one")
    // console.log(screen_one)
    // // screenOne.load()
    // // screenOne.play()
    // vidOne_Texture = new THREE.VideoTexture(screenOne)
    // vidOne_Texture.minFilter = THREE.LinearFilter;
    // vidOne_Texture.magFilter = THREE.LinearFilter;

    // let vidMaterial = new THREE.MeshBasicMaterial({
    //     map: vidOne_Texture, //set material Property to video texture
    //     side: THREE.DoubleSide, //show vid on front side
    //     toneMapped: false // turn off tone mapping
    // })
    let pos = new THREE.Vector3(0.745769, -0.332765, -3.57589)

    const geometry = new THREE.PlaneGeometry(1.19775, 0.749114);
    // TODO set to video materail
    const screen_mesh = new THREE.Mesh(geometry, material);
    // screen_mesh.position.copy(pos);
    screen_mesh.position.set(.5, .5, .5)
    screen_mesh.rotation.y = -0.349066
    // screen_mesh.rotation.copy(object.rotation);
    // screen_mesh.scale.copy(object.scale);
    scene.add(screen_mesh);

    // const div = document.createElement('div');
    // div.style.width = '100px';
    // div.style.height = '100px';
    // div.style.background = 'red';
    // div.style.opacity = 1;
    // div.classList.add('contains_screen');

    // const img = document.createElement("img");
    // img.setAttribute('id', 'imgOne')
    // img.src = vidOne
    // img.setAttribute('alt', "screen video here")
    // div.appendChild(img);

    // const h1 = document.createElement("h1");
    // h1.style.fontSize = '200px';
    // h1.style.color = 'orange';
    // h1.append('hello there')
    // div.appendChild(h1);
    // // location

    // let object = new CSS3DObject(div);
    // object.position.copy(pos);
    // object.rotation.y = -0.349066
    // cssScene.add(object);
    // console.log(object);
    // size


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

