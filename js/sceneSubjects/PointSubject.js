function PointSubject(scene){

    var currentPoints = [];

    const MAX_POINTS = 5000;
    const geometry = new THREE.BufferGeometry();
    const positionsBuffer = new Float32Array( MAX_POINTS * 3 ); 

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsBuffer, 3));
    geometry.computeBoundingSphere();

    const material = new THREE.PointsMaterial({size: 3, color: "#F00"});
    
    const points = new THREE.Points(geometry, material);
    points.geometry.setDrawRange( 0, 0 ); 
    scene.add(points);

    this.update = function () {

    }

    this.insert = function (point) {
        var currentIndex = currentPoints.length * 3;
        currentPoints.push(point);

        var positions = points.geometry.attributes.position.array;
        positions[ currentIndex ++ ] = point.x;
        positions[ currentIndex ++ ] = point.y;
        positions[ currentIndex  ] = point.z;

        points.geometry.attributes.position.needsUpdate = true;   
        points.geometry.setDrawRange( 0, currentPoints.length ); 
    }

}