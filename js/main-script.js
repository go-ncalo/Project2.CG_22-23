
//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;
var geometry, material, mesh;
const materials = [];
var cameraTexture;
var fieldTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
var skyTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
var fieldScene, skyScene;
var field, sky, moon, stem, stem1, leaf, leaf1, ship, cockpit, cylinderOvni, building;
var spheres = [];
var stems = [];
var leaves = [];
var heightMapTexture;
var controls;
var moonDirectionalLight, moonAmbientLight, sphereLight, cylinderLight;
var sphereLights = [];
const clock = new THREE.Clock();
var delta;
var k = {};
var isBasic = false;
var cameraVR;

const
    Q = 81, W = 87, E = 69, R = 82,
    S = 83, P = 80, A = 65, D = 68,
    LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40,
    N1 = 49, N2 = 50;



/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();
    fieldScene = new THREE.Scene();
    skyScene = new THREE.Scene();

    fieldScene.background = new THREE.Color(0xa3e27e);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = -70;
    camera.position.y = 40;
    camera.position.x = -30;

    camera.lookAt(0, 30, 0);

    cameraVR = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );

    //controls = new THREE.OrbitControls(camera, renderer.domElement);

    cameraTexture = new THREE.OrthographicCamera(width / - 70, width / 70, height / 70, height / - 70, -10, 1000);
    cameraTexture.position.z = 15;
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict';
    moonDirectionalLight = new THREE.DirectionalLight(0xf3d150, 0.2);
    moonDirectionalLight.position.set(moon.position.x, moon.position.y, moon.position.z);
    moonAmbientLight = new THREE.AmbientLight(0xf3d150, 0.5);
    moon.add(moonDirectionalLight);
    scene.add(moonAmbientLight);

}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createMaterials() {
    'use strict';
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff});
    materials.push(material);
    material = new THREE.MeshBasicMaterial({ color: 0xffea00});
    materials.push(material);
    material = new THREE.MeshBasicMaterial({ color: 0xe1c4ff});
    materials.push(material);
    material = new THREE.MeshBasicMaterial({ color: 0xc3eefa});
    materials.push(material);
}

function createFlowerFieldTexture() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 500; j++) {
            const geometry = new THREE.CircleGeometry(0.05, 32); 
            const flower = new THREE.Mesh(geometry, materials[i]);

            flower.position.x = Math.random() * window.innerWidth / 35 - window.innerWidth / 70;
            flower.position.y = Math.random() * window.innerHeight / 35 - window.innerHeight / 70;
            
            fieldScene.add(flower);
        }
    }
}

function createStarySkyTexture() {
    for (let i = 0; i < 300; i++) {
        const geometry = new THREE.CircleGeometry(0.02, 32);
        const star = new THREE.Mesh(geometry, materials[0]);

        star.position.x = Math.random() * window.innerWidth / 35 - window.innerWidth / 70;
        star.position.y = Math.random() * window.innerHeight / 35 - window.innerHeight / 70;

        skyScene.add(star);
    }

    var skyGeometry = new THREE.PlaneGeometry(window.innerWidth / 35, window.innerHeight / 35);

    let blue = { r: 0.00, g: 0.00, b: 0.280 } // Dark blue
    let purple = { r: 0.250, g: 0.00, b: 0.280 }  // Dark purple

    var colors = new Float32Array([
        blue.r, blue.g, blue.b,      // top left
        blue.r, blue.g, blue.b,      // top right
        purple.r, purple.g, purple.b,      // purpleottom left
        purple.r, purple.g, purple.b ]);   // bottom right

    skyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var skyGradient = new THREE.MeshBasicMaterial({ vertexColors: true });
    var sky = new THREE.Mesh(skyGeometry, skyGradient);

    sky.position.x = 0;
    sky.position.y = 0;
    sky.position.z = -1;

    skyScene.add(sky);
}

function createField() {
    const geometry = new THREE.PlaneBufferGeometry(200, 200, 100, 100);
    const loader = new THREE.TextureLoader();
    heightMapTexture = loader.load('js/textures/heightmap.png');
    const material = new THREE.MeshPhongMaterial({displacementMap: heightMapTexture, displacementScale: 50});

    field = new THREE.Mesh(geometry, material);

    field.rotation.x = -Math.PI / 2;
    scene.add(field);
}

function createSky() {
    const geometry = new THREE.SphereBufferGeometry(100, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const material = new THREE.MeshPhongMaterial({side: THREE.BackSide});
    
    sky = new THREE.Mesh(geometry, material);

    scene.add(sky);
}

function createMoon() {
    const geometry = new THREE.SphereBufferGeometry(10, 100, 100);
    const material = new THREE.MeshPhongMaterial({color: 0xf3d150, emissive: 0xf3d150, emissiveIntensity: 0.5});

    moon = new THREE.Mesh(geometry, material);

    moon.position.x = 40;
    moon.position.y = 75;
    moon.position.z = 20;

    scene.add(moon);
}

function createOakStem(obj) {
    const stemGeometry = new THREE.CylinderBufferGeometry(1.5, 1.5, 15, 100);
    const stemMaterial = new THREE.MeshPhongMaterial({color: 0x932e0f});
    stem = new THREE.Mesh(stemGeometry, stemMaterial);

    const stem1Geometry = new THREE.CylinderBufferGeometry(1, 1, 7, 100);
    const stem1Material = new THREE.MeshPhongMaterial({color: 0x932e0f});
    stem1 = new THREE.Mesh(stem1Geometry, stem1Material);

    stem.rotation.x = -Math.PI / 10;

    stem1.position.z = 2.5;
    stem1.rotation.x = Math.PI / 5;

    stems.push(stem);
    stems.push(stem1);

    stem.add(stem1);
    obj.add(stem);
}

function createOakLeaf(obj) {
    const leafGeometry = new THREE.SphereBufferGeometry(5, 100, 100);
    const leafMaterial = new THREE.MeshPhongMaterial({color: 0x006400});
    leaf = new THREE.Mesh(leafGeometry, leafMaterial);

    const leaf1Geometry = new THREE.SphereBufferGeometry(7, 100, 100);
    const leaf1Material = new THREE.MeshPhongMaterial({color: 0x006400});
    leaf1 = new THREE.Mesh(leaf1Geometry, leaf1Material);

    leaf.position.y = 5;
    leaf.position.z = 5;

    leaf.scale.x = 0.5;
    leaf.scale.y = 0.5;

    leaf1.position.y = 6;
    leaf1.position.z = -8;

    leaves.push(leaf);
    leaves.push(leaf1);

    leaf.add(leaf1);
    obj.add(leaf);
}

function createCorkOak(x, y, z, scale, rotation) {
    const corkOak = new THREE.Object3D();

    createOakStem(corkOak);
    createOakLeaf(corkOak);

    corkOak.position.x = x;
    corkOak.position.y = y;
    corkOak.position.z = z;

    corkOak.scale.x = scale;
    corkOak.scale.y = scale;
    corkOak.scale.z = scale;

    corkOak.rotation.y = rotation;

    scene.add(corkOak);

    return corkOak;
}

function createShip(obj, x, y, z) {
    const geometry = new THREE.SphereBufferGeometry(10, 100, 100);
    const material = new THREE.MeshPhongMaterial({color: 0xa7a7a7});

    ship = new THREE.Mesh(geometry, material);

    ship.scale.y = 0.4;

    ship.position.x = x;
    ship.position.y = y;
    ship.position.z = z;

    obj.add(ship);
}

function createCockpit(obj, x, y, z) {
    const geometry = new THREE.SphereBufferGeometry(5, 100, 100);
    const material = new THREE.MeshPhongMaterial({color: 'white'});

    cockpit = new THREE.Mesh(geometry, material);

    cockpit.position.x = x;
    cockpit.position.y = y;
    cockpit.position.z = z;

    obj.add(cockpit);
}

function createSphere(obj, x, y, z) {
    const geometry = new THREE.SphereBufferGeometry(0.7, 100, 100);
    const material = new THREE.MeshPhongMaterial({color: 0xffa500, emissive: 0xffa500, emissiveIntensity: 0.3});

    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;

    sphereLight = new THREE.PointLight( 0xff0000, 0.05, 50);
    sphereLights.push(sphereLight);
    sphere.add(sphereLight);

    spheres.push(sphere);

    obj.add(sphere);
}

function createRadialSphere(obj, x, y, z, rotation) {
    let radial = new THREE.Object3D();

    createSphere(radial, 4.5, 36.75, 4.5);
    radial.position.x = x;
    radial.position.x = y;
    radial.position.x = z;
    radial.rotation.y = rotation;
    obj.add(radial);
}

function createCylinder(obj, x, y, z) {
    const geometry = new THREE.CylinderBufferGeometry(2.5, 2.5, 2.5, 100);
    const material = new THREE.MeshPhongMaterial({color: 'yellow', emissive: 'yellow', emissiveIntensity: 0.3});

    cylinderOvni = new THREE.Mesh(geometry, material);

    cylinderOvni.position.x = x;
    cylinderOvni.position.y = y;
    cylinderOvni.position.z = z;

    cylinderLight = new THREE.SpotLight('yellow', 0.5, 50);
    cylinderOvni.add(cylinderLight);

    obj.add(cylinderOvni);
}

function createOvni(y) {
    ovni = new THREE.Object3D();

    createShip(ovni, 0, 40, 0);
    createCockpit(ovni, 0, 42.5, 0);
    for (let i = 0; i < 10; i++) {
        createRadialSphere(ovni, 0, 0, 0, ((2*Math.PI/10) * i));
    }
    createCylinder(ovni, 0, 36.5, 0);

    ovni.position.y = y;

    scene.add(ovni);
}

function createBuilding(obj) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0, 0, 0,       //v0
        0, 4.5, 0,     //v1
        0, 7.5, 0,     //v2
        0, 10, 0,      //v3
        2.25, 4.5, 0,   //v4
        2.25, 7.5, 0,   //v5
        5.25, 7.5, 0,   //v6
        5.25, 4.5, 0,   //v7
        7.5, 0, 0,      //v8
        7.5, 4.5, 0,    //v9
        7.5, 7.5, 0,    //v10
        12.5, 7.5, 0,   //v11
        12.5, 4.5, 0,   //v12
        12.5, 0, 0,     //v13
        14.75, 4.5, 0,  //v14
        14.75, 7.5, 0,  //v15
        17.75, 7.5, 0,  //v16
        17.75, 4.5, 0,  //v17
        20, 0, 0,       //v18
        20, 4.5, 0,     //v19
        20, 7.5, 0,     //v20
        20, 10, 0,      //v21
        0, 0, 0,       //v22
        0, 0, 10,       //v23
        0, 10, 0,      //v24
        0, 10, 10,      //v25
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const indices = [8, 0, 9, 0, 1, 9, 1, 2, 5, 1, 5, 4, 2, 3, 21, 2, 21, 20, 7, 6, 10,
                    10, 9, 7, 13, 12, 19, 19, 18, 13, 17, 16, 20, 20, 19, 17, 12, 11, 15,
                    12, 15, 14, 22, 23, 24, 23, 25, 24];

    geometry.setIndex( indices );

    geometry.computeVertexNormals()

    const material = new THREE.MeshPhongMaterial({color: 'white', side: THREE.FrontSide});

    building = new THREE.Mesh(geometry, material);

    obj.add(building);
}

function createHouse(x, y, z) {
    const house = new THREE.Object3D();
    //createRoof(house);
    //createChimney(house);
    createBuilding(house);
    //createDoor(house);

    scene.add(house);
    house.position.set(x, y, z);
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    ovni.rotation.y += 1 * delta;

    let vector = new THREE.Vector3(0,0,0);
    if (k[LEFT]) { // LEFT
        vector.x -= 1;
    }

    if (k[RIGHT]) { // RIGHT
        vector.x += 1;
    }

    if (k[UP]) { // UP
        vector.z -= 1;
    }

    if (k[DOWN]) { // DOWN
        vector.z += 1;
    }
    vector.normalize();
    ovni.position.add(vector.multiplyScalar(10  * delta));

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.xr.enabled = true;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));
    
    createScene();
    createOvni(15);
    createMaterials();
    createFlowerFieldTexture();
    createStarySkyTexture();
    createField();
    createSky();
    createMoon();
    createCorkOak(5, 27, 5, 1, 0);
    createCorkOak(50, 19, -15, 0.8, Math.PI/2);
    createCorkOak(-40, 25, -20, 1.2, Math.PI/4);
    createCorkOak(-30, 25, 30, 1.1, Math.PI/6);
    createCorkOak(60, 20, 60, 1, Math.PI/3);
    createCorkOak(40, 20, -40, 0.9, Math.PI/2);
    createHouse(-15, 19.5, -30); 
    createLights();
    createCameras();

    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(0, 25, 0);
    cameraGroup.lookAt(ovni.position.x - 7, ovni.position.y + 2, ovni.position.z + 7);
    

    //When user turn on the VR mode.
    renderer.xr.addEventListener('sessionstart', function () {
        scene.add(cameraGroup);
        cameraGroup.add(camera);
    });

    renderer.setAnimationLoop(animate);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    delta = clock.getDelta();
    update();   
    //controls.update();
    render();
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    if (!k[e.keyCode])
        switch (e.keyCode) {
            case N1:
                renderer.setRenderTarget(fieldTexture);
                renderer.render(fieldScene, cameraTexture);
                field.material = new THREE.MeshPhongMaterial({map: fieldTexture.texture, displacementMap: heightMapTexture, displacementScale: 50});
                break;
            case N2:
                renderer.setRenderTarget(skyTexture);
                renderer.render(skyScene, cameraTexture);            
                sky.material = new THREE.MeshPhongMaterial({map: skyTexture.texture, side: THREE.BackSide});
                break;
            case D:
                moonDirectionalLight.visible = !moonDirectionalLight.visible;
                break;
            case P:
                for (let i = 0; i < sphereLights.length; i++) {
                    sphereLights[i].visible = !sphereLights[i].visible;
                }
                break;
            case S:
                cylinderLight.visible = !cylinderLight.visible;
                break;

            case Q:
                moon.material = new THREE.MeshLambertMaterial({color: 0xf3d150, emissive: 0xf3d150, emissiveIntensity: 0.5});
                for (let i = 0; i < stems.length; i++) {
                    stems[i].material = new THREE.MeshLambertMaterial({color: 0x932e0f});
                }
                for (let i = 0; i < leaves.length; i++) {
                    leaves[i].material = new THREE.MeshLambertMaterial({color: 0x006400});
                }
                ship.material = new THREE.MeshLambertMaterial({color: 0xa7a7a7});
                cockpit.material =  new THREE.MeshLambertMaterial({color: 'white'});
                for (let i = 0; i < spheres.length; i++) {
                    spheres[i].material = new THREE.MeshLambertMaterial({color: 0xffa500, emissive: 0xffa500, emissiveIntensity: 0.3});
                }
                cylinderOvni.material = new THREE.MeshLambertMaterial({color: 'yellow', emissive: 'yellow', emissiveIntensity: 0.3});
                building.material = new THREE.MeshLambertMaterial({color: 'white'});                

                isBasic = false;
                break;
            
            case W:
                moon.material = new THREE.MeshPhongMaterial({color: 0xf3d150, emissive: 0xf3d150, emissiveIntensity: 0.5});
                for (let i = 0; i < stems.length; i++) {
                    stems[i].material = new THREE.MeshPhongMaterial({color: 0x932e0f});
                }
                for (let i = 0; i < leaves.length; i++) {
                    leaves[i].material = new THREE.MeshPhongMaterial({color: 0x006400});
                }
                ship.material = new THREE.MeshPhongMaterial({color: 0xa7a7a7});
                cockpit.material =  new THREE.MeshPhongMaterial({color: 'white'});
                for (let i = 0; i < spheres.length; i++) {
                    spheres[i].material = new THREE.MeshPhongMaterial({color: 0xffa500, emissive: 0xffa500, emissiveIntensity: 0.3});
                }
                cylinderOvni.material = new THREE.MeshPhongMaterial({color: 'yellow', emissive: 'yellow', emissiveIntensity: 0.3});
                building.material = new THREE.MeshPhongMaterial({color: 'white'});

                isBasic = false;
                break;
            
            case E:
                moon.material = new THREE.MeshToonMaterial({color: 0xf3d150, emissive: 0xf3d150, emissiveIntensity: 0.5});
                for (let i = 0; i < stems.length; i++) {
                    stems[i].material = new THREE.MeshToonMaterial({color: 0x932e0f});
                }
                for (let i = 0; i < leaves.length; i++) {
                    leaves[i].material = new THREE.MeshToonMaterial({color: 0x006400});
                }
                ship.material = new THREE.MeshToonMaterial({color: 0xa7a7a7});
                cockpit.material =  new THREE.MeshToonMaterial({color: 'white'});
                for (let i = 0; i < spheres.length; i++) {
                    spheres[i].material = new THREE.MeshToonMaterial({color: 0xffa500, emissive: 0xffa500, emissiveIntensity: 0.3});
                }
                cylinderOvni.material = new THREE.MeshToonMaterial({color: 'yellow', emissive: 'yellow', emissiveIntensity: 0.3});
                building.material = new THREE.MeshToonMaterial({color: 'white'});

                isBasic = false;
                break;
            
            case R:
                if (!isBasic) {
                moon.material = new THREE.MeshBasicMaterial({color: 0xf3d150});
                for (let i = 0; i < stems.length; i++) {
                    stems[i].material = new THREE.MeshBasicMaterial({color: 0x932e0f});
                }
                for (let i = 0; i < leaves.length; i++) {
                    leaves[i].material = new THREE.MeshBasicMaterial({color: 0x006400});
                }
                ship.material = new THREE.MeshBasicMaterial({color: 0xa7a7a7});
                cockpit.material =  new THREE.MeshBasicMaterial({color: 'white'});
                for (let i = 0; i < spheres.length; i++) {
                    spheres[i].material = new THREE.MeshBasicMaterial({color: 0xffa500});
                }
                cylinderOvni.material = new THREE.MeshBasicMaterial({color: 'yellow'});
                building.material = new THREE.MeshBasicMaterial({color: 'white'});

                isBasic = true;
                break;
                } else {
                    moon.material = new THREE.MeshPhongMaterial({color: 0xf3d150, emissive: 0xf3d150, emissiveIntensity: 0.5});
                    for (let i = 0; i < stems.length; i++) {
                        stems[i].material = new THREE.MeshPhongMaterial({color: 0x932e0f});
                    }
                    for (let i = 0; i < leaves.length; i++) {
                        leaves[i].material = new THREE.MeshPhongMaterial({color: 0x006400});
                    }
                    ship.material = new THREE.MeshPhongMaterial({color: 0xa7a7a7});
                    cockpit.material =  new THREE.MeshPhongMaterial({color: 'white'});
                    for (let i = 0; i < spheres.length; i++) {
                        spheres[i].material = new THREE.MeshPhongMaterial({color: 0xffa500, emissive: 0xffa500, emissiveIntensity: 0.3});
                    }
                    cylinderOvni.material = new THREE.MeshPhongMaterial({color: 'yellow', emissive: 'yellow', emissiveIntensity: 0.3});
                    building.material = new THREE.MeshPhongMaterial({color: 'white'});

                    isBasic = false;
                    break;
                }
        }
    k[e.keyCode] = true;
}
///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    k[e.keyCode] = false;
}