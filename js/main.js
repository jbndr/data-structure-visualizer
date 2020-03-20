const canvas = document.querySelector('#scene-container');

const sceneManager = new SceneManager(canvas);
const statManager = new StatManager(canvas);
const guiManager = null;

const events = {
    TOGGLE_UI: 72,
    ADD_POINT: 80
};

bindEventListeners();
setAnimationLoop();

function bindEventListeners() {
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('keydown', onKeyDown);
}

function onWindowResize() {
    sceneManager.onWindowResize();
}

function onKeyDown(event) {

    switch (event.which) {
        case events.ADD_POINT:
            sceneManager.addPoint();
            break;

        case events.TOGGLE_UI:
            //guiManager.toggleUI();
            /*
            if(infoContainer.style.visibility != "hidden"){
                infoContainer.style.visibility = "hidden";
                hideInfo.style.visibility = "hidden";
                document.body.removeChild(stats.dom);
            } else {
                infoContainer.style.visibility = "visible";
                document.body.appendChild(stats.dom);
            }
            */
            break;

    
        default:
            break;
    }

}

function setAnimationLoop() {
    sceneManager.setAnimationLoop(statManager);
}