let container;
let camera;
let renderer;
let scene;
let mesh;

function init() {

    container = document.querySelector('#scene-container');

    scene = new THREE.Scene();
    scene.background = new THREE.Color('gray');

    createCamera();
    createMeshes();
    createRenderer();

    renderer.setAnimationLoop( () => {
        update();
        render();
      } );

}

function createCamera() {

    const fov = 35; 
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1; 
    const far = 100;
    
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 10);

}

function createMeshes() {

    const geometry = new THREE.BoxBufferGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xEEEEEE });
    mesh = new THREE.Mesh( geometry, material );

    scene.add(mesh);

}

function createRenderer() {

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

}

function update() {

    mesh.rotation.z += 0.01;
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

}

function render() {

    renderer.render(scene, camera);

}


function onWindowResize() {

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
  
}

window.addEventListener('resize', onWindowResize);
init();

