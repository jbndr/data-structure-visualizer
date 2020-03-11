let container;
let camera;
let controls;
let renderer;
let scene;

let root;
let points = [];

function init() {

    root = new Octree(new Boundary(new Point(0, 0, 0), 128, 128, 128), 5);
    var maxX = root.boundary.center.x + root.boundary.width / 2;
    var minX = root.boundary.center.x - root.boundary.width / 2;
    var maxY = root.boundary.center.y + root.boundary.height / 2;
    var minY = root.boundary.center.y - root.boundary.height / 2;
    var maxZ = root.boundary.center.z - root.boundary.depth / 2;
    var minZ = root.boundary.center.z + root.boundary.depth / 2;

    for (var i = 0; i < 15; i++){
        var x = Math.random() * (maxX - minX) + minX;
        var y = Math.random() * (maxY - minY) + minY;
        var z = Math.random() * (maxZ - minZ) + minZ;
        root.insert(new Point(x, y, z))
    }

    console.log(root);

    container = document.querySelector('#scene-container');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); //0x202632

    createCamera();
    createControls();
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
    const far = 1000;
    
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 350);

}

function createControls() {

    controls = new THREE.OrbitControls(camera, container);
  
}

function createMeshes() {

    createQuadTreeMeshes(root);
    createPoints();

}

function createQuadTreeMeshes(quad){

    const height = quad.boundary.width;
    const width = quad.boundary.height;
    const depth = quad.boundary.depth;

    const geometry = new THREE.BoxBufferGeometry(width, height, depth);

    const edges = new THREE.EdgesGeometry(geometry);
    line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x00BFA5} ));
    scene.add(line);

    const center = quad.boundary.center;
    line.position.set(center.x, center.y, center.z);

    quad.points.forEach(point => {
        points.push(point.x, point.y, point.z);
    });

    quad.children.forEach(child => {
        createQuadTreeMeshes(child);
    });

}

function createPoints() {

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3 ));
    geometry.computeBoundingSphere();

    var material = new THREE.PointsMaterial({size: 3});
    
    points = new THREE.Points(geometry, material);
    scene.add(points);

}

function createRenderer() {

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

}

function update() {


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

