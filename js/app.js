let container;
let camera;
let controls;
let renderer;
let scene;

let root;
let pointsArray;
let centerArray = [];

let appearance;
let description;
let pointInfo;
let infoContainer;
let hideInfo;

let stats;

let maxX;
let minX;
let maxY;
let minY;
let maxZ;
let minZ;

var shouldUpdate = false;

const datastructures = {
    OCTREE: "Octree",
    KDTREE: "Kd-Tree"
}

let datastructure = datastructures.OCTREE;

class Appearance {
    constructor(backgroundColor = 0x10307, strokeColor = 0x00BFA5, pointColor = 0xFFFFFF, pointSize = 3){
        this.backgroundColor = backgroundColor;
        this.strokeColor = strokeColor;
        this.pointColor = pointColor;
        this.pointSize = pointSize;
    }
} 

function init() {

    appearance = new Appearance();

    container = document.querySelector('#scene-container');
    description = document.querySelector('#info');
    infoContainer = document.querySelector('#info-container');
    pointInfo = document.querySelector('#point-info');
    hideInfo = document.querySelector('#hide-info');

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
    maxX = root.boundary.center.x + root.boundary.width / 2;
    minX = root.boundary.center.x - root.boundary.width / 2;
    maxY = root.boundary.center.y + root.boundary.height / 2;
    minY = root.boundary.center.y - root.boundary.height / 2;
    maxZ = root.boundary.center.z - root.boundary.depth / 2;
    minZ = root.boundary.center.z + root.boundary.depth / 2;

}

function createStats() {

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);


}

function createGUI() {

    description.innerHTML = datastructure;

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

}

function createCamera() {

    const fov = 35; 
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1; 
    const far = 3500;
    
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 375);

}

function createControls() {

    controls = new THREE.OrbitControls(camera, container);
  
}

function createMeshes() {
 
    pointsArray = [];

    switch (datastructure) {
        case datastructures.OCTREE:
            createQuadTreeMeshes(root);
            break;

        case datastructures.KDTREE:
            break;
    
        default:
            break;
    }

    createPoints();

}

function createQuadTreeMeshes(quad){

    const center = quad.boundary.center;
    if (!centerArray.includes(center)){
        const height = quad.boundary.width;
        const width = quad.boundary.height;
        const depth = quad.boundary.depth;
    
        const geometry = new THREE.BoxBufferGeometry(width, height, depth);
    
        const edges = new THREE.EdgesGeometry(geometry);
        line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: appearance.strokeColor}));
        line.position.set(center.x, center.y, center.z);
        scene.add(line);
        centerArray.push(center);
    }

    quad.points.forEach(point => {
        pointsArray.push(point.x, point.y, point.z);
    });

    quad.children.forEach(child => {
        createQuadTreeMeshes(child);
    });

}

function createPoints() {

    if (pointsArray.length == 0){
        return;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(pointsArray, 3));
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

    if (shouldUpdate){
        shouldUpdate = false;
        createMeshes();
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

function onKeyDown(event){

    // p == 80: create new point
    if (event.which == 80){
        let x = Math.random() * (maxX - minX) + minX;
        let y = Math.random() * (maxY - minY) + minY;
        let z = Math.random() * (maxZ - minZ) + minZ;
        root.insert(new Point(x, y, z));
        shouldUpdate = true;
        pointMessage = `Point (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}) has been added.`;
        pointInfo.innerHTML = pointMessage;
    } else if (event.which == 72){ // h == 72: hide ui elements
        if(infoContainer.style.visibility != "hidden"){
            infoContainer.style.visibility = "hidden";
            hideInfo.style.visibility = "hidden";
            document.body.removeChild(stats.dom);
        } else {
            infoContainer.style.visibility = "visible";
            document.body.appendChild(stats.dom);
        }
    }
}

window.addEventListener('resize', onWindowResize);
window.addEventListener('keydown', onKeyDown);

init();