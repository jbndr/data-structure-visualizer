let container;
let camera;
let controls;
let renderer;
let scene;

let root;
let points = [];

let appearance;

let stats;
let clock;

class Appearance {
    constructor(backgroundColor = 0x10307, strokeColor = 0x00BFA5, pointColor = 0xFFFFFF, pointSize = 3, rotate = false){
        this.backgroundColor = backgroundColor;
        this.strokeColor = strokeColor;
        this.pointColor = pointColor;
        this.pointSize = pointSize;
        this.rotate = rotate;
    }
} 

function init() {

    appearance = new Appearance();
    clock = new THREE.Clock();

    container = document.querySelector('#scene-container');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(appearance.backgroundColor);

    createRoot();
    createStats();
    createCamera();
    createControls();
    createMeshes();
    createRenderer();
    createGUI();

    renderer.setAnimationLoop( () => {
        stats.begin();
        update();
        render();
        stats.end();
      } );

}

function createRoot() {

    root = new Octree(new Boundary(new Point(0, 0, 0), 128, 128, 128), 5);
    var maxX = root.boundary.center.x + root.boundary.width / 2;
    var minX = root.boundary.center.x - root.boundary.width / 2;
    var maxY = root.boundary.center.y + root.boundary.height / 2;
    var minY = root.boundary.center.y - root.boundary.height / 2;
    var maxZ = root.boundary.center.z - root.boundary.depth / 2;
    var minZ = root.boundary.center.z + root.boundary.depth / 2;

    for (var i = 0; i < 200; i++){
        var x = Math.random() * (maxX - minX) + minX;
        var y = Math.random() * (maxY - minY) + minY;
        var z = Math.random() * (maxZ - minZ) + minZ;
        root.insert(new Point(x, y, z))
    }
    
}

function createStats() {

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

}

function createGUI() {

    var gui = new dat.GUI();

    var f1 = gui.addFolder('Appearance');
    f1.addColor(appearance, 'backgroundColor').onChange(() => {
        scene.background = new THREE.Color(appearance.backgroundColor);
    });
    f1.addColor(appearance, 'strokeColor').onChange(() => {
        for (var i = 0; i < scene.children.length; i++){
            currentType = scene.children[i].type;
            if (currentType == "LineSegments"){
                scene.children[i].material.color = new THREE.Color(appearance.strokeColor);
            }
        }
    });
    f1.addColor(appearance, 'pointColor').onChange(() => {
        for (var i = 0; i < scene.children.length; i++){
            currentType = scene.children[i].type;
            if (currentType == "Points"){
                scene.children[i].material.color = new THREE.Color(appearance.pointColor);
            }
        }
    });
    f1.add(appearance, 'pointSize', 1, 10).onChange(() => {
        for (var i = 0; i < scene.children.length; i++){
            currentType = scene.children[i].type;
            if (currentType == "Points"){
                scene.children[i].material.size = appearance.pointSize;
            }
        }
    });
    f1.add(appearance, 'rotate');

    f1.open();
}

function createCamera() {

    const fov = 35; 
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1; 
    const far = 3500;
    
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
    line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: appearance.strokeColor} ));
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
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.computeBoundingSphere();

    var material = new THREE.PointsMaterial({size: appearance.pointSize, color: appearance.pointColor});
    
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

    if(appearance.rotate){
        delta = clock.getDelta()
        scene.rotateY(delta * 0.1);
    }

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