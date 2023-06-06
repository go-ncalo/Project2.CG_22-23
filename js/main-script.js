
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
var field, sky;
var heightMapTexture;
var controls;
var moonDirectionalLight;
var moonAmbientLight;


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
    camera.position.y = 35;
    camera.position.x = -70;

    camera.lookAt(scene.position);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    cameraTexture = new THREE.OrthographicCamera(width / - 70, width / 70, height / 70, height / - 70, -10, 1000);
    cameraTexture.position.z = 15;

}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict';
    moonDirectionalLight = new THREE.DirectionalLight(0xf3d150, 0.5);
    moonAmbientLight = new THREE.AmbientLight(0xf3d150, 0.3);
    moon.add(moonDirectionalLight);
    moon.add(moonAmbientLight);

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

    // Set the vertex colors
    skyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Note: no color is set on the material definition, only the attribute vertexColors is set to true
    var skyGradient = new THREE.MeshBasicMaterial({ vertexColors: true });
    var sky = new THREE.Mesh(skyGeometry, skyGradient);

    sky.position.x = 0;
    sky.position.y = 0;
    sky.position.z = -1;

    skyScene.add(sky);
}

function createField() {
    const geometry = new THREE.CircleGeometry(100, 100);
    const loader = new THREE.TextureLoader();
    heightMapTexture = loader.load('js/textures/heightmap.png');
    const material = new THREE.MeshStandardMaterial({displacementMap: heightMapTexture, displacementScale: 15});

    field = new THREE.Mesh(geometry, material);

    field.rotation.x = -Math.PI / 2;
    scene.add(field);
}

function createSky() {
    const geometry = new THREE.SphereBufferGeometry(100, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({side: THREE.BackSide});
    
    sky = new THREE.Mesh(geometry, material);

    scene.add(sky);
}

function createMoon() {
    const geometry = new THREE.SphereBufferGeometry(10, 100, 100);
    const material = new THREE.MeshStandardMaterial({color: 0xf3d150, emissive: 0xf3d150, emissiveIntensity: 0.5});

    moon = new THREE.Mesh(geometry, material);

    moon.position.x = 50;
    moon.position.y = 50;
    moon.position.z = 50;

    scene.add(moon);
}

function createOakStem(obj) {
    const stemGeometry = new THREE.CylinderBufferGeometry(1.5, 1.5, 15, 100);
    const stemMaterial = new THREE.MeshStandardMaterial({color: 0x8b4513});
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);

    const stem1Geometry = new THREE.CylinderBufferGeometry(1, 1, 7, 100);
    const stem1Material = new THREE.MeshStandardMaterial({color: 0x8b4513});
    const stem1 = new THREE.Mesh(stem1Geometry, stem1Material);

    stem.rotation.x = -Math.PI / 10;

    stem1.position.z = 2.5;
    stem1.rotation.x = Math.PI / 5;

    stem.add(stem1);
    obj.add(stem);
}

function createOakLeaf(obj) {
    const leafGeometry = new THREE.SphereBufferGeometry(5, 100, 100);
    const leafMaterial = new THREE.MeshStandardMaterial({color: 0x006400});
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);

    const leaf1Geometry = new THREE.SphereBufferGeometry(7, 100, 100);
    const leaf1Material = new THREE.MeshStandardMaterial({color: 0x006400});
    const leaf1 = new THREE.Mesh(leaf1Geometry, leaf1Material);

    leaf.position.y = 5;
    leaf.position.z = 5;

    leaf.scale.x = 0.5;
    leaf.scale.y = 0.5;

    leaf1.position.y = 6;
    leaf1.position.z = -8;

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

    const sphereLight = new THREE.PointLight( 0xff0000, 0.1, 50);
    sphere.add(sphereLight);


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

    const cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.x = x;
    cylinder.position.y = y;
    cylinder.position.z = z;

    const cylinderLight = new THREE.SpotLight('yellow', 0.5, 50);
    cylinder.add(cylinderLight);

    obj.add(cylinder)
}

function createOvni() {
    ovni = new THREE.Object3D();

    createShip(ovni, 0, 40, 0);
    createCockpit(ovni, 0, 42.5, 0);
    for (let i = 0; i < 10; i++) {
        createRadialSphere(ovni, 0, 0, 0, ((2*Math.PI/10) * i));
    }
    createCylinder(ovni, 0, 36.5, 0);

    scene.add(ovni);
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.setRenderTarget(fieldTexture);
    renderer.render(fieldScene, cameraTexture);

    renderer.setRenderTarget(skyTexture);
    renderer.render(skyScene, cameraTexture);

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
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    createScene();
    createCameras();
    createMaterials();
    createFlowerFieldTexture();
    createStarySkyTexture();
    createField();
    createSky();
    createMoon();
    createCorkOak(20, 10, 20, 1, Math.PI/5);
    createCorkOak(30, 10, -10, 0.8, Math.PI/2);
    createCorkOak(-35, 9, -25, 0.7, -Math.PI/5);
    createCorkOak(-25, 9, 25, 1.3, -Math.PI/4);
    createCorkOak(0, 9, -35, 1, -Math.PI);
    createOvni();
    createLights();



    window.addEventListener("keydown", onKeyDown);
    //window.addEventListener("resize", onResize);
    //window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    controls.update();
    render();
    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    // DESLIGAR AS LUZES

    // when 1 is pressed change material of field to the texture still having the displacement map  
    if (e.keyCode == 49) {
        field.material = new THREE.MeshPhongMaterial({map: fieldTexture.texture, displacementMap: heightMapTexture, displacementScale: 15});
    }
    // when 2 is pressed change material of cube to the texture
    if (e.keyCode == 50) {
        sky.material = new THREE.MeshBasicMaterial({map: skyTexture.texture, side: THREE.BackSide});
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}