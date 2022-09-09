import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import plant from "./assets/models/plant.gltf";
import scene_import from "./assets/models/scene.gltf"
import rainbow_ft from "./assets/rainbow_ft.png";
import rainbow_bk from "./assets/rainbow_bk.png";
import rainbow_up from "./assets/rainbow_up.png";
import rainbow_dn from "./assets/rainbow_dn.png";
import rainbow_rt from "./assets/rainbow_rt.png";
import rainbow_lf from "./assets/rainbow_lf.png";
 // gltf loader
const loadModels = (scene, THREE)=>{
    const gltfLoader = new GLTFLoader();
    // gltfLoader.load(plant, (gltf) => {
    //     gltf.scene.traverse((c) => {
    //         c.castShadow = true;
    //         c.receiveShadow = true;
    //         c.position.x = 3.7
    //         c.scale.set(.18, .18, .18)
    //     });
    //     scene.add(gltf.scene);
    // });
    // gltfLoader.load(desk_chair, (gltf) => {
    //     gltf.scene.traverse((c) => {
    //         c.castShadow = true;
    //         c.receiveShadow = true;
    //         c.position.z = 0
    //         c.position.y = .23
    //         // c.scale.set(.18, .18, .18)
    //     });
    //     scene.add(gltf.scene);
    // });

    // gltfLoader.load(desk, (gltf) => {
    //     gltf.scene.traverse((c) => {
    //         c.castShadow = true;
    //         c.receiveShadow = true;
    //         c.position.z = -2;
    //         c.position.y = .57;
    //         c.position.x = .5
    //         // c.rotation.y = Math.PI / 1
    //         // c.scale.set(.18, .18, .18)

    //     });
    //     scene.add(gltf.scene);
    // });
    gltfLoader.load(scene_import, (gltf) => {
        gltf.scene.traverse((c) => {
            c.castShadow = true;
            c.receiveShadow = true;
            // c.position.y = -1;

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
export {loadModels}