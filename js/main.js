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

                let outerWorld = {
                    seaweedGenerator: seaweedGenerator
                };
                this.seaweedArray.push(new Seaweed(position, outerWorld));
            }
        },
        doProcess: function(dt) {
            this.seaweedArray.forEach(s => {
                s.doLive(dt);
            });
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
        },
        doRemoveObject: function(object) {
            let i = this.aquaticArray.indexOf(object);
            if (i > -1) {
                this.aquaticArray.splice(i, 1);
                object.el.remove();
            }
        }
    };

    let audioMuteBtn = {
        muted: true,
        create: function() {
            let el = document.createElement('button');
            el.className = 'audiomute off';
            el.onclick = function() {
                audioMuteBtn.muted = !audioMuteBtn.muted;
                el.className = 'audiomute ' + (audioMuteBtn.muted ? 'off' : 'on');
            }

            document.body.appendChild(el);
        }
    };
    audioMuteBtn.create();

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
        seaweedGenerator.doProcess(dt);

        requestAnimationFrame(callback);
    });
})();