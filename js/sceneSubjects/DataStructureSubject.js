function DataStructureSubject(scene) {

    const dataStructure = new OctreeSubject(scene);
    const pointSubject = new PointSubject(scene);
    const sceneSubjects = buildSceneSubjects();
    

    const minPoint = dataStructure.getMinPoint();
    const maxPoint = dataStructure.getMaxPoint();

    function buildSceneSubjects() {
        const sceneSubjects = [
            dataStructure,
            pointSubject
        ];

        return sceneSubjects;
    }

    function generatePoint(){
        let x = Math.random() * (maxPoint.x - minPoint.x) + minPoint.x;
        let y = Math.random() * (maxPoint.y - minPoint.y) + minPoint.y;
        let z = Math.random() * (maxPoint.z - minPoint.z) + minPoint.z;

        return new Point(x, y, z);
    }

    this.addPoint = function () {
        const point = generatePoint();

        dataStructure.insert(point);
        pointSubject.insert(point);
    }

    this.update = function () {
        for (var i = 0; i < sceneSubjects.length; i++)
            sceneSubjects[i].update();
    }
}