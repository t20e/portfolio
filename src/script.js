import "./styles/main.scss";
import * as THREE from "three";
import {
    LoadingManager
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AxesHelper } from "three/src/helpers/AxesHelper.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import satoshi_light from "./assets/Satoshi-Light.ttf";
import satoshi_regular from "./assets/Satoshi-Regular.ttf";
import threejsFont from "three/examples/fonts/droid/droid_sans_bold.typeface.json"
import backCubeBox from "./assets/nz.png";
import rightCubeBox from "./assets/pz.png";
import downCubeBox from "./assets/ny.png";
import frontCubeBox from "./assets/px.png";
import leftCubeBox from "./assets/nx.png";
import topCubeBox from "./assets/py.png";

import {
    CSS3DRenderer,
    CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import afterLoad from "./afterLoad";
import scene_import from "./assets/models/desk_space.glb";




let scene, loadingScene, cssScene, camera, renderer, cssRenderer, controls, clock, mixer, mouse, raycaster, selectedObj = null;
let dirLight, pointLightOne, pointLightTwo, pointLightThree;

let player = { height: 1.8 };
let USE_WIREFRAME = true;
let vid_texture;
const fontLoader = new FontLoader();
const ttfLoader = new TTFLoader();
let allowNextScene = false;
// const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide });
let gltfSceneHolder, skyboxHolder;
// passing in the loadManager to every instance of a loader such as GLTFLoader etc,
const loadManager = new LoadingManager();

let textMesh, numMesh;
const progressBar = document.getElementById('progress_bar');
const progressLabel = document.getElementsByTagName('label')[0];

let aboutMeRenderer = null

const checkIfOnMobile = () => {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}
export const isOnMobile = checkIfOnMobile()

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

let requestLoadFrames;
const animateLoadScreen = () => {
    const time = Date.now() * 0.0005;
    pointLightOne.position.x = Math.sin(time) * 20
    pointLightOne.position.z = Math.cos(time) * 20
    pointLightTwo.position.z = Math.sin(time) * 20
    pointLightTwo.position.x = Math.cos(time) * 20
    pointLightThree.position.z = Math.sin(time * 2) * 20
    pointLightThree.position.x = Math.cos(time * 2) * 20
    renderer.render(loadingScene, camera);
    requestLoadFrames = requestAnimationFrame(animateLoadScreen);
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
    alert('please reload their was an error loading models')
};

const init = () => {
    scene = new THREE.Scene();
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 7);
    hemiLight.color.setHSL(0.6, 0.2, 0.1);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 5, 0);
    // hemiLight.castShadow = true;
    scene.add(hemiLight);
    // i only show the links and suggest them to visit the website on a computer
    // const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 2);
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
    // scene.add(cube);
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
    cancelAnimationFrame(requestLoadFrames)
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
    let texture_ft = new THREE.TextureLoader().load(frontCubeBox);
    let texture_bk = new THREE.TextureLoader().load(leftCubeBox);
    let texture_up = new THREE.TextureLoader().load(topCubeBox);
    let texture_dn = new THREE.TextureLoader().load(downCubeBox);
    let texture_rt = new THREE.TextureLoader().load(rightCubeBox);
    let texture_lf = new THREE.TextureLoader().load(backCubeBox);

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
    let skyBoxGeo = new THREE.BoxGeometry(100, 100, 100);
    let skyBox = new THREE.Mesh(skyBoxGeo, materialArr);
    skyBox.position.y = 1;
    // scene.add(skyBox)
    skyboxHolder = skyBox;
};

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
    aboutMeRenderer.setSize(window.innerWidth, window.innerHeight);
};
const createAboutMeDiv = () => {
    const elem = document.createElement('div')
    elem.setAttribute('id', 'about_me')
    const img = document.createElement('img')
    img.src = "https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/YX7tMvIf4SOgsbjcM3SmNYaPXRg4wfgY"
    const p = document.createElement('p')
    if(isOnMobile){
        p.textContent += `Hello, I'm tony. A year 
        and a half ago I was in the construction field of weatherizing homes, 
        now I am a software developer. Why the career change? To answer the question I have always been 
        fascinated with tech and specifically robotics. I didn't feel attached to my previous position, so why not do something
        I like? When I discovered that many professionals in this field have attained their profession without a bachelor's or any
        other major degree. I jumped at the chance to achieve my goal. Some of my interests are gaming, 3d engines like blender,
        artificial intelligence, financial markets, and football. You can see all my projects if you visit this site on a computer.`
    }else{
        p.textContent += `Hello, I'm tony. A year 
        and a half ago I was in the construction field of weatherizing homes, 
        now I am a software developer. Why the career change? To answer the question I have always been 
        fascinated with tech and specifically robotics. I didn't feel attached to my previous position, so why not do something
        I like? When I discovered that many professionals in this field have attained their profession without a bachelor's or any
        other major degree. I jumped at the chance to achieve my goal. Some of my interests are gaming, 3d engines like blender,
        artificial intelligence, financial markets, and football.`
    }
    elem.append(img, p)
    return elem
}
window.addEventListener('resize', onWindowResize, false);

if (isOnMobile) {
    alert('This site is not fully supported on mobile, please visit on a computer to see all my projects, thanks!');
    afterLoad()
    const elem = createAboutMeDiv()
    document.body.prepend(elem)
} else {
    loadModels();
}