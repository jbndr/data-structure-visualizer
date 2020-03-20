function OctreeSubject(scene) {

    const root = new Octree(new Boundary(new Point(0, 0, 0), 128, 128, 128), 5, show);
    show(root);

    function show(octreeQuad) {

        const center = octreeQuad.boundary.center;

        const height = octreeQuad.boundary.width;
        const width = octreeQuad.boundary.height;
        const depth = octreeQuad.boundary.depth;

        const geometry = new THREE.BoxBufferGeometry(width, height, depth);

        const edges = new THREE.EdgesGeometry(geometry);
        line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: "#0F0" }));
        line.position.set(center.x, center.y, center.z);
        
        scene.add(line);

    }

    this.getMinPoint = function () {
        let minX = root.boundary.center.x - root.boundary.width / 2;
        let minY = root.boundary.center.y - root.boundary.height / 2;
        let minZ = root.boundary.center.z + root.boundary.depth / 2;

        return new Point(minX, minY, minZ);
    }

    this.getMaxPoint = function () {
        let maxX = root.boundary.center.x + root.boundary.width / 2;
        let maxY = root.boundary.center.y + root.boundary.height / 2;
        let maxZ = root.boundary.center.z - root.boundary.depth / 2;

        return new Point(maxX, maxY, maxZ);
    }

    this.update = function () {

    }

    this.insert = function (point) {
        root.insert(point);
    }


}