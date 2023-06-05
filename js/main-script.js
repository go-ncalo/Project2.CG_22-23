
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
    camera.position.z = 70;
    camera.position.y = 35;
    camera.position.x = 70;

    camera.lookAt(scene.position);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    cameraTexture = new THREE.OrthographicCamera(width / - 70, width / 70, height / 70, height / - 70, -10, 1000);
    cameraTexture.position.z = 15;

}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

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
        for (let j = 0; j < 400; j++) {
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
    const geometry = new THREE.PlaneBufferGeometry(100, 100, 50, 50);
    const loader = new THREE.TextureLoader();
    heightMapTexture = loader.load('js/textures/heightmap.png');
    const material = new THREE.MeshPhongMaterial({displacementMap: heightMapTexture, displacementScale: 15});

    field = new THREE.Mesh(geometry, material);

    field.rotation.x = -Math.PI / 2;
    scene.add(field);
}

function createSky() {
    const geometry = new THREE.SphereBufferGeometry(100, 100, 100);
    const material = new THREE.MeshPhongMaterial({side: THREE.BackSide});
    
    sky = new THREE.Mesh(geometry, material);


    scene.add(sky);
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
    var light = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(light);

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