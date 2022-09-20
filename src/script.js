import "./styles/main.scss";
import * as THREE from "three";
import {
    LoadingManager
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AxesHelper } from "three/src/helpers/AxesHelper.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import satoshi_light from "./assets/Satoshi-Light.ttf";
import satoshi_regular from "./assets/Satoshi-Regular.ttf";
import threejsFont from "three/examples/fonts/droid/droid_sans_bold.typeface.json"
import rainbow_ft from "./assets/rainbow_ft.png";
import rainbow_bk from "./assets/rainbow_bk.png";
import rainbow_up from "./assets/rainbow_up.png";
import rainbow_dn from "./assets/rainbow_dn.png";
import rainbow_rt from "./assets/rainbow_rt.png";
import rainbow_lf from "./assets/rainbow_lf.png";
import scene_import from "./assets/models/scene.gltf";
import {
    CSS3DRenderer,
    CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";
let scene, cssScene, camera, renderer, cssRenderer, controls, clock, mixer;
let player = { height: 1.8 };
let USE_WIREFRAME = true;
let vid_texture;
import afterLoad from "./afterLoad";
const fontLoader = new FontLoader();
const ttfLoader = new TTFLoader();
import bodymovin from "bodymovin";
import Lottie from "lottie-web";
import handgesture from "./assets/hand_gesture.json"

// const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide });
let gltfSceneHolder, skyboxHolder;
let dirLight, pointLightOne, pointLightTwo, pointLightThree;
let textMesh, numMesh;
const progressBar = document.getElementById('progress_bar');
const progressLabel = document.getElementsByTagName('label')[0];

// const material = new THREE.MeshBasicMaterial({ color: 0x69934, wireframe: USE_WIREFRAME, wireframeLinewidth: 1, side: THREE.FrontSide });
const loadManager = new LoadingManager();
// passing in the loadManager to every instance of a loader such as GLTFLoader etc,
// gltf loader
let allowNextScene = false;
loadManager.onStart = (url, item, total) => {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // enable shadows
    renderer.shadowMap.enabled = true;
    renderer.domElement.setAttribute("id", "loading_renderer");
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5
    camera.position.y = 7
    camera.position.x = -3
    camera.lookAt(0, 0, 0)
    scene.add(camera);

    const axesHelper = new AxesHelper(10);
    // scene.add(axesHelper);

    pointLightOne = new THREE.PointLight("#EE6123", 1, 100);
    pointLightOne.position.set(-8, 4, -6);
    pointLightOne.shadow.mapSize.width = 4096
    pointLightOne.shadow.mapSize.height = 4096
    pointLightOne.castShadow = true;
    scene.add(pointLightOne);
    // scene.add(new THREE.PointLightHelper(pointLightOne, .5, 0xff000000))

    pointLightTwo = new THREE.PointLight("#FA003F", 1, 100);
    pointLightTwo.position.set(-3, 8, -4);
    pointLightTwo.shadow.mapSize.width = 4096
    pointLightTwo.shadow.mapSize.height = 4096
    pointLightTwo.castShadow = true;
    scene.add(pointLightTwo);
    // scene.add(new THREE.PointLightHelper(pointLightTwo, .5, 0xff000000))

    pointLightThree = new THREE.PointLight("#FFCF00", 1, 100);
    pointLightThree.position.set(8, 8, -2);
    pointLightThree.shadow.mapSize.width = 4096
    pointLightThree.shadow.mapSize.height = 4096
    pointLightThree.castShadow = true;
    scene.add(pointLightThree);
    // scene.add(new THREE.PointLightHelper(pointLightThree, .5, 0xff000000))

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 30),
        new THREE.MeshPhongMaterial({ color: "#FEEFE5" })
    );
    // plane.position.y = -.17
    plane.receiveShadow = true;
    plane.rotation.x = - Math.PI / 2;
    scene.add(plane);
    let text;
    ttfLoader.load(satoshi_regular, (json) => {
        // parse the ttf json  
        let font = fontLoader.parse(json);

        let textcount = 'Loading scene...'
        let i = 0;
        let prevMeshX = -3
        let addChars = setInterval(() => {
            console.log(i)
            if (i > 14) {
                clearInterval(addChars)
                allowNextScene = true;
            }
            text = textcount[i]
            const textGeo = new TextGeometry(text, {
                font: font,
                size: .5,
                height: .08, // is the depth of the text geometry
            })
            textMesh = new THREE.Mesh(textGeo, [
                new THREE.MeshPhongMaterial({ color: '#FEEFE5' }), //front
                new THREE.MeshPhongMaterial({ color: '#FAAA75' }), //side
            ]);
            textMesh.castShadow = true;
            textMesh.receiveShadow = true;
            textMesh.rotation.x = -Math.PI / 2
            textMesh.position.y = .05
            if (i == 0) {
                // textMesh.position.x = -2.3;
                textMesh.position.x = prevMeshX
            }
            if (textcount[i] === 'i') {
                textMesh.position.x = prevMeshX + .45
            } else if (i === 5) {
                textMesh.position.x = prevMeshX + .21
            }
            else {
                textMesh.position.x = prevMeshX + .4
            }
            prevMeshX = textMesh.position.x;
            scene.add(textMesh);
            i++
        }, 200)
    })
    animateLoadScreen();
};
const animateLoadScreen = () => {
    if (progressBar.value = 100 && allowNextScene === true) {
        console.log('end'); return
    }
    const time = Date.now() * 0.0005;
    pointLightOne.position.x = Math.sin(time) * 20
    pointLightOne.position.z = Math.cos(time) * 20
    pointLightTwo.position.z = Math.sin(time) * 20
    pointLightTwo.position.x = Math.cos(time) * 20
    pointLightThree.position.z = Math.sin(time * 2) * 20
    pointLightThree.position.x = Math.cos(time * 2) * 20
    renderer.render(scene, camera);
    requestAnimationFrame(animateLoadScreen);
};
loadManager.onProgress = (url, loaded, total) => {
    // console.log(url, loaded, total);
    // console.log('progress loading')
    progressBar.value = Math.trunc((loaded / total) * 100);
    progressLabel.innerHTML = progressBar.value + '%'
    // oldProgressPercentage = progressBar
}


loadManager.onLoad = () => {
    console.log('finished loading')
    // TODO when it does load the scene then wait a second or two and then show the new scene
    renderer.renderLists.dispose();
    document.getElementById('loading_renderer').remove()
    progressBar.remove()
    progressLabel.remove()
    init();
    document.getElementById('overlay').style.display = 'block';
    afterLoad(Lottie);
}

loadManager.onError = (url) => {
    console.log("err loading file =>", url);
};
const gltfLoader = new GLTFLoader(loadManager);


const init = () => {
    scene = new THREE.Scene();
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.color.setHSL(0.2, 0.2, 0.1);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 2, 0);
    // hemiLight.castShadow = true;
    scene.add(hemiLight);

    const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 2);
    // scene.add(hemiLightHelper);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // renderer.setClearColor(0x000000, 0); // the default
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.shadowMap.enabled = true;
    renderer.domElement.setAttribute("id", "renderer");
    document.body.appendChild(renderer.domElement);



    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    // camera.position.y = 0;
    camera.position.z -= 0.01;
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.rotateSpeed = -0.3;
    controls.enablePan = false;
    // controls.update()
    scene.add(camera);
    camera.lookAt(-0.72123, -0.332765, -3.59841, 0.349066)
    screensRender("screen_one", 0.745769, -0.332765, -3.57589, -0.349066);
    screensRender("screen_two", -0.72123, -0.332765, -3.59841, 0.349066);
    // axe helper
    const axesHelper = new AxesHelper(10);
    // scene.add(axesHelper);
    // controls for drag and scroll
    document.addEventListener("wheel", onMouseWheel);
    controls.addEventListener("change", userDrag);
    scene.add(gltfSceneHolder);
    scene.add(skyboxHolder);
    animate();
};
const userDrag = ()=>{
    document.getElementById("handGesture").remove();
    controls.removeEventListener("change", userDrag);
}
const animate = () => {
    // this loops to create frames
    requestAnimationFrame(animate);
    // update video texture
    // vid_texture.needsUpdate = true;
    renderer.render(scene, camera);
    controls.update();
    // cssRenderer.render(cssScene, camera);
};

const loadModels = () => {
    gltfLoader.load(scene_import, (gltf) => {
        gltf.scene.traverse((c) => {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        // scene.add(gltf.scene);
        gltfSceneHolder = gltf.scene;
    });

    let materialArr = [];
    // load the images as texture
    let texture_ft = new THREE.TextureLoader().load(rainbow_ft);
    let texture_bk = new THREE.TextureLoader().load(rainbow_bk);
    let texture_up = new THREE.TextureLoader().load(rainbow_up);
    let texture_dn = new THREE.TextureLoader().load(rainbow_dn);
    let texture_rt = new THREE.TextureLoader().load(rainbow_rt);
    let texture_lf = new THREE.TextureLoader().load(rainbow_lf);

    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_up }));
    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
    materialArr.push(new THREE.MeshBasicMaterial({ map: texture_lf }));
    // this will make it so the texture is applied to the outside instead of on the cubemap
    for (let i = 0; i < 6; i++) {
        materialArr[i].side = THREE.BackSide;
    }

    let skyBoxGeo = new THREE.BoxGeometry(10, 10, 10);
    let skyBox = new THREE.Mesh(skyBoxGeo, materialArr);
    skyBox.position.y = 1;
    // scene.add(skyBox)
    skyboxHolder = skyBox;
};
loadModels();

// id, pos(xyz), roation.y
const screensRender = (id, x, y, z, rotateY) => {
    let screen = document.getElementById(id);
    // console.log(screen_one)
    // screen.load()
    screen.play();
    vid_texture = new THREE.VideoTexture(screen);
    vid_texture.minFilter = THREE.LinearFilter;
    vid_texture.magFilter = THREE.LinearFilter;
    screen.remove();
    let vidMaterial = new THREE.MeshBasicMaterial({
        map: vid_texture, //set material Property to video texture
        side: THREE.FrontSide, //show vid on front side
        toneMapped: false, // turn off tone mapping
    });
    let pos = new THREE.Vector3(x, y, z);

    const geometry = new THREE.PlaneGeometry(1.19775, 0.749114);
    const screen_mesh = new THREE.Mesh(geometry, vidMaterial);
    screen_mesh.position.copy(pos);
    // screen_mesh.position.set(.5, .5, .5)
    screen_mesh.rotation.y = rotateY;
    // screen_mesh.rotation.copy(object.rotation);
    // screen_mesh.scale.copy(object.scale);
    scene.add(screen_mesh);
};

const onMouseWheel = (e) => {
    const fov = camera.fov + e.deltaY * 0.05;
    // console.log((fov));
    camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
};
const onWindowResize = () => {
    console.log('Window resize');

    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // cssRenderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
};
window.addEventListener('resize', onWindowResize, false);

// init();
