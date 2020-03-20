function StatManager(canvas) {

    const stats = new Stats();
    stats.showPanel(0);
    canvas.appendChild(stats.dom);

    this.begin = function() {
        stats.begin();
    }

    this.end = function() {
        stats.end();
    }
    
}