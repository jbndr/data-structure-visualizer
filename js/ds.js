class Point {
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Boundary {
    constructor(center, width, height, depth){
        this.center = center;
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    contains(point){
        // axis aligned cube
        var xMin = this.center.x - this.width / 2;
        var xMax = this.center.x + this.width / 2;
        var yMin = this.center.y - this.height / 2;
        var yMax = this.center.y + this.height / 2;
        var zMin = this.center.z - this.depth / 2;
        var zMax = this.center.z + this.depth / 2;

        return point.x >= xMin && point.x <= xMax && 
               point.y >= yMin && point.y <= yMax && 
               point.z >= zMin && point.z <= zMax;
    }
}

class Octree {
    children = [];
    points = [];
    isSubdivided = false;

    constructor(boundary, capacity){
        this.boundary = boundary;
        this.capacity = capacity;
    }

    subdivide(){

        for (var x = -1; x < 2; x+=2){
            for (var y = -1; y < 2; y+=2){
                for (var z = -1; z < 2; z+=2){
                    var newX = this.boundary.center.x + Math.sign(x) * this.boundary.width / 4;
                    var newY = this.boundary.center.y + Math.sign(y) * this.boundary.height / 4;
                    var newZ = this.boundary.center.z + Math.sign(z) * this.boundary.depth / 4;
                    var newCenter = new Point(newX, newY, newZ);
                    var newBoundary = new Boundary(newCenter, this.boundary.width / 2,
                         this.boundary.height / 2, this.boundary.depth / 2);
                    var newQuad = new Octree(newBoundary, this.capacity);
                    newQuad.insertAll(this.points);
                    this.children.push(newQuad);
                }
            }
        }

        this.points = [];
        this.isSubdivided = true;
    }

    insert(point){

        if (!this.boundary.contains(point)){
            return;
        }

        if (this.points.length < this.capacity && !this.isSubdivided){
            this.points.push(point);
            return;
        } else if (!this.isSubdivided){
            this.points.push(point);
            this.subdivide();
            return;
        }

        this.children.forEach(child => {
            child.insert(point);
        });

    }

    insertAll(points){
        points.forEach(point => {
            this.insert(point)
        });
    }
}