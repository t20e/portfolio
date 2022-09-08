import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import plant from "./assets/models/plant.gltf";
import desk_chair from "./assets/models/desk_chair.gltf"
import desk from './assets/models/desk.gltf'
import scene_import from "./assets/models/scene.gltf"
 // gltf loader
const loadModels = (scene)=>{
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

}
export {loadModels}