(function() {
    let seaweedGenerator = {
        generatorAcc: 0,
        generatorSpeed: 2000,
        seaweedArray: [],
        doGen: function(dt) {
            this.generatorAcc += dt;
            if (this.generatorAcc > this.generatorSpeed) {
                this.generatorAcc -= this.generatorSpeed;
                let position = Utils.generateRandomPosition(Seaweed.prototype);
                this.seaweedArray.push(new Seaweed(position));
            }
        },
        doRemoveObject: function(object) {
            let i = this.seaweedArray.indexOf(object);
            if (i > -1) {
                this.seaweedArray.splice(i, 1);
                object.el.remove();
            }
        }
    };

    let position = Utils.generateRandomPosition(Aquatic.prototype);
    let value = Math.random();
    let a1 = new Aquatic(position, value, seaweedGenerator);

    let prev = performance.now();
    requestAnimationFrame(function callback(time) {
        let dt = time - prev;
        prev = time;

        a1.doDecideThink(dt);
        a1.doMoveSmart(dt);
        seaweedGenerator.doGen(dt);

        requestAnimationFrame(callback);
    });
})();