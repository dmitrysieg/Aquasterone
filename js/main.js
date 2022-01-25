(function() {
    let x1 = (Aquatic.prototype.width / 2) + Math.random() * (document.body.clientWidth - Aquatic.prototype.width);
    let y1 = (Aquatic.prototype.height / 2) + Math.random() * (document.body.clientHeight - Aquatic.prototype.height);
    let value1 = Math.random();
    let a1 = new Aquatic(x1, y1, value1);

    let prev = performance.now();
    requestAnimationFrame(function callback(time) {
        let dt = time - prev;
        prev = time;

        a1.doMoveSmart(dt);
        requestAnimationFrame(callback);
    });
})();