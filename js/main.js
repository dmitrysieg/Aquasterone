(function() {
    let position = Utils.generateRandomPosition(Aquatic.prototype);
    let value = Math.random();
    let a1 = new Aquatic(position, value);

    let seaweedGenerator = {
        acc: 0,
        doGen: function(dt) {
            this.acc += dt;
            if (this.acc > 5000) {
                this.acc = 0;
                let position = Utils.generateRandomPosition(Seaweed.prototype);
                new Seaweed(position);
            }
        }
    };

    let prev = performance.now();
    requestAnimationFrame(function callback(time) {
        let dt = time - prev;
        prev = time;

        a1.doMoveSmart(dt);
        seaweedGenerator.doGen(dt);

        requestAnimationFrame(callback);
    });
})();