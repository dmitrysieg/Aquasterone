(function() {
    let seaweedGenerator = {
        generatorAcc: 0,
        generatorSpeed: 1000,
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

    let aquaticGenerator = {
        aquaticArray: [],
        doGen: function() {
            let position = Utils.generateRandomPosition(Aquatic.prototype);
            let value = Math.random();
            let outerWorld = {
                aquaticGenerator: aquaticGenerator,
                seaweedGenerator: seaweedGenerator
            };
            this.aquaticArray.push(new Aquatic(position, value, outerWorld));
        },
        doProcess: function(dt) {
            this.aquaticArray.forEach(a => {
                a.doLive(dt);
            });
        }
    };

    aquaticGenerator.doGen();
    aquaticGenerator.doGen();
    aquaticGenerator.doGen();
    aquaticGenerator.doGen();
    aquaticGenerator.doGen();

    let prev = performance.now();
    requestAnimationFrame(function callback(time) {
        let dt = time - prev;
        prev = time;

        aquaticGenerator.doProcess(dt);

        seaweedGenerator.doGen(dt);

        requestAnimationFrame(callback);
    });
})();