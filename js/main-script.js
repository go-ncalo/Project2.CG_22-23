//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;
var geometry, material, mesh;
const materials = [];
var fieldTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight);
var skyTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight);
var fieldScene, skyScene;
var cube, cube2;

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

    camera = new THREE.OrthographicCamera(width / - 70, width / 70, height / 70, height / - 70, -10, 1000);
    camera.position.z = 2;

    camera.lookAt(scene.position);
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

function createFlowerField() {
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

function createStarySky() {
    for (let i = 0; i < 1000; i++) {
        const geometry = new THREE.CircleGeometry(0.05, 32);
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

function createBox() {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({});
    cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
}

function createBox2() {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({});
    cube2 = new THREE.Mesh(geometry, material);

    cube2.position.x = 10;

    scene.add(cube2);
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
    renderer.render(fieldScene, camera);

    renderer.setRenderTarget(skyTexture);
    renderer.render(skyScene, camera);

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
    createFlowerField();
    createStarySky();
    createBox();
    createBox2();

    window.addEventListener("keydown", onKeyDown);
    //window.addEventListener("resize", onResize);
    //window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

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

    // when 1 is pressed change material of cube to the texture
    if (e.keyCode == 49) {
        cube.material = new THREE.MeshBasicMaterial({ map: fieldTexture.texture });
    }

    // when 2 is pressed change material of cube to the texture
    if (e.keyCode == 50) {
        cube2.material = new THREE.MeshBasicMaterial({ map: skyTexture.texture });
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}