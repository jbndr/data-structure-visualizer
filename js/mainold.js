let appearance;
let description;
let pointInfo;
let infoContainer;
let hideInfo;

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

    createGUI();

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

// Logic

function onKeyDown(event) {
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