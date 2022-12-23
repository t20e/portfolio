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
import scene_import from "./assets/models/scene.glb";
import {
    CSS3DRenderer,
    CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import afterLoad from "./afterLoad";
let scene, loadingScene, cssScene, camera, renderer, cssRenderer, controls, clock, mixer, mouse, raycaster, selectedObj = null;
let dirLight, pointLightOne, pointLightTwo, pointLightThree;

let player = { height: 1.8 };
let USE_WIREFRAME = true;
let vid_texture;
const fontLoader = new FontLoader();
const ttfLoader = new TTFLoader();

// const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide });
let gltfSceneHolder, skyboxHolder;
// passing in the loadManager to every instance of a loader such as GLTFLoader etc,
const loadManager = new LoadingManager();

let textMesh, numMesh;
const progressBar = document.getElementById('progress_bar');
const progressLabel = document.getElementsByTagName('label')[0];

let allowNextScene = false;
let aboutMeRenderer = null



loadManager.onStart = (url, item, total) => {
    loadingScene = new THREE.Scene();
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
    loadingScene.add(camera);

    const axesHelper = new AxesHelper(10);
    // loadingScene.add(axesHelper);

    pointLightOne = new THREE.PointLight("#EE6123", 1, 100);
    pointLightOne.position.set(-8, 4, -6);
    pointLightOne.shadow.mapSize.width = 4096
    pointLightOne.shadow.mapSize.height = 4096
    pointLightOne.castShadow = true;
    loadingScene.add(pointLightOne);
    // loadingScene.add(new THREE.PointLightHelper(pointLightOne, .5, 0xff000000))

    pointLightTwo = new THREE.PointLight("#FA003F", 1, 100);
    pointLightTwo.position.set(-3, 8, -4);
    pointLightTwo.shadow.mapSize.width = 4096
    pointLightTwo.shadow.mapSize.height = 4096
    pointLightTwo.castShadow = true;
    loadingScene.add(pointLightTwo);
    // loadingScene.add(new THREE.PointLightHelper(pointLightTwo, .5, 0xff000000))

    pointLightThree = new THREE.PointLight("#FFCF00", 1, 100);
    pointLightThree.position.set(8, 8, -2);
    pointLightThree.shadow.mapSize.width = 4096
    pointLightThree.shadow.mapSize.height = 4096
    pointLightThree.castShadow = true;
    loadingScene.add(pointLightThree);
    // loadingScene.add(new THREE.PointLightHelper(pointLightThree, .5, 0xff000000))

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 30),
        new THREE.MeshPhongMaterial({ color: "#FEEFE5" })
    );
    // plane.position.y = -.17
    plane.receiveShadow = true;
    plane.rotation.x = - Math.PI / 2;
    loadingScene.add(plane);
    let text;
    ttfLoader.load(satoshi_regular, (json) => {
        // parse the ttf json  
        let font = fontLoader.parse(json);

        let textcount = 'Loading scene...'
        let i = 0;
        let prevMeshX = -3
        let addChars = setInterval(() => {
            // console.log(i)
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
            loadingScene.add(textMesh);
            i++
        }, 200)
    })
    animateLoadScreen();
};
const animateLoadScreen = () => {
    if (progressBar.value = 100 && allowNextScene === true) {
        console.log('end loading'); return
    }
    const time = Date.now() * 0.0005;
    pointLightOne.position.x = Math.sin(time) * 20
    pointLightOne.position.z = Math.cos(time) * 20
    pointLightTwo.position.z = Math.sin(time) * 20
    pointLightTwo.position.x = Math.cos(time) * 20
    pointLightThree.position.z = Math.sin(time * 2) * 20
    pointLightThree.position.x = Math.cos(time * 2) * 20
    renderer.render(loadingScene, camera);
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
    loadingScene.clear()
    progressBar.remove()
    progressLabel.remove()
    renderer = null;
    camera = null;
    document.getElementById('loading_renderer').remove()
    init();
    afterLoad()
}

loadManager.onError = (url) => {
    console.log("err loading file =>", url);
};

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
    camera.position.z -= 0.01;
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.rotateSpeed = -0.3;
    controls.enablePan = false;
    // controls.update()
    scene.add(camera);
    // racycaster
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();

    const geometry = new THREE.BoxGeometry(.5, .5, .5);
    const material = new THREE.MeshBasicMaterial({ color: 'red' });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(10, 10, 2);
    scene.add(cube);
    // TODO add this back
    // cube.position.set(1.5, -.7, 2);
    selectedObj = cube;
    screensRender("screen_one", 0.745769, -0.332765, -3.57589, -0.349066);
    screensRender("screen_two", -0.72123, -0.332765, -3.59841, 0.349066);
    // axe helper
    const axesHelper = new AxesHelper(10);
    // scene.add(axesHelper);
    // controls for drag and scroll
    document.addEventListener("wheel", onMouseWheel);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClickObj);
    controls.addEventListener("change", userDrag);
    scene.add(gltfSceneHolder);
    scene.add(skyboxHolder);
    // render css onto the scene
    aboutMeRenderer = new CSS2DRenderer();
    aboutMeRenderer.setSize(window.innerWidth, window.innerHeight)
    aboutMeRenderer.domElement.style.position = "absolute";
    aboutMeRenderer.domElement.style.top = '0px'
    aboutMeRenderer.domElement.style.pointerEvents = "none"
    const aboutMeElem = createAboutMeDiv()
    const aboutMeObj = new CSS2DObject(aboutMeElem)
    scene.add(aboutMeObj)
    aboutMeObj.position.set(-5, 3.5, 4)
    document.body.appendChild(aboutMeRenderer.domElement)
    animate();
};
const userDrag = () => {
    document.getElementById("handGesture").remove();
    controls.removeEventListener("change", userDrag);
}

const animate = () => {
    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(mouse, camera);
    // this loops to create frames
    requestAnimationFrame(animate);
    // update video texture
    // vid_texture.needsUpdate = true;
    renderer.render(scene, camera);
    aboutMeRenderer.render(scene, camera);
    controls.update();
    // cssRenderer.render(cssScene, camera);
};
const gltfLoader = new GLTFLoader(loadManager);
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/'); // use a full url path
// gltfLoader.setDRACOLoader(dracoLoader);

const loadModels = () => {
    gltfLoader.load(scene_import, (gltf) => {
        gltf.scene.traverse((c) => {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        gltfSceneHolder = gltf.scene;
        // console.log(gltfSceneHolder)
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

const screensRender = (id, x, y, z, rotateY) => {
    let screen = document.getElementById(id);
    // console.log(screen_one)
    screen.load()
    screen.play();
    vid_texture = new THREE.VideoTexture(screen);
    vid_texture.minFilter = THREE.LinearFilter;
    vid_texture.magFilter = THREE.LinearFilter;
    // screen.remove();
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
    scene.add(screen_mesh);
};
const onClickObj = () => {
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObjects(scene.children);
    for (let i = 0; i < intersect.length; i++) {
        if (intersect[i].object === selectedObj) {
            console.log('cube clicked')
        }
    }
}
const onMouseMove = (e) => {
    // calculates mouse position
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
}
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
    aboutMeRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
};
const createAboutMeDiv = () => {
    const elem = document.createElement('div')
    elem.setAttribute('id', 'about_me')
    const img = document.createElement('img')
    img.src = "https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/YX7tMvIf4SOgsbjcM3SmNYaPXRg4wfgY"
    const p = document.createElement('p')
    p.textContent += `Hello, I'm tony. A year and a half ago I was in the construction field of weatherizing homes, now I am a software developer. Why the career change? To answer the question I have always been fascinated with tech and specifically robotics. I didn't feel attached to my previous position, so why not do something I like? When I discovered that many professionals in this field have attained their profession without a bachelor's or any other major degree. I jumped at the chance to achieve my goal. Some of my interests are gaming, 3d engines like blender, artificial intelligence, financial markets, and football.`
    elem.append(img, p)
    return elem
}
window.addEventListener('resize', onWindowResize, false);
