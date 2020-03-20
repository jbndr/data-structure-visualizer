function SceneManager(canvas) {

    const screenDimensions = {
        width: canvas.clientWidth,
        height: canvas.clientHeight
    }

    const scene = buildScene();
    const renderer = buildRenderer(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const controls = buildControls(camera);
    const sceneSubject = new DataStructureSubject(scene)

    function buildControls(camera) {
        return new THREE.OrbitControls(camera, canvas);
    }

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");

        return scene;
    }

    function buildRenderer({ width, height }) {
        const renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        canvas.appendChild(renderer.domElement);

        return renderer;
    }

    function buildCamera({ width, height }) {
        const fieldOfView = 35;
        const aspectRatio = width / height;
        const nearPlane = 0.1;
        const farPlane = 3500;

        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.set(0, 0, 375);

        return camera;
    }

    function update() {
        sceneSubject.update();
    }

    function render() {
        renderer.render(scene, camera);
    }

    this.addPoint = function () {
        sceneSubject.addPoint();
    }

    this.onWindowResize = function () {
        const { clientWidth, clientHeight } = canvas;

        screenDimensions.width = clientWidth;
        screenDimensions.height = clientHeight;

        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(clientWidth, clientHeight);
    }

    this.setAnimationLoop = function (statManager) {
        renderer.setAnimationLoop(() => {
            statManager.begin();
            update();
            controls.update();
            render();
            statManager.end();
        });
    }

}