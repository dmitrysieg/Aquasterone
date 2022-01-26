(function() {

    let media = {
        muted: true,
        playSound: function(name) {
            if (!this.muted) {
                new Audio(name).play();
            }
        },
        bubble: function() {
            this.playSound('bubble.wav');
        },
        seaweed: function() {
            this.playSound('seaweed.wav');
        },
        die: function() {
            this.playSound('die.wav');
        },
        seaweedDie: function() {
            this.playSound('seaweed_die.wav');
        }
    };

    let seaweedGenerator = {
        generatorAcc: 0,
        generatorSpeed: 1000,
        generatorDispersion: 0.2,
        nextGeneratorThreshold: 0,
        seaweedArray: [],
        doGen: function(dt) {

            if (!this.nextGeneratorThreshold) {
                this.nextGeneratorThreshold = this.createGeneratorThreshold();
            }

            this.generatorAcc += dt;
            if (this.generatorAcc > this.nextGeneratorThreshold) {
                this.generatorAcc -= this.nextGeneratorThreshold;
                this.nextGeneratorThreshold = this.createGeneratorThreshold();

                let position = Utils.generateRandomPosition(Seaweed.prototype);

                let outerWorld = {
                    seaweedGenerator: seaweedGenerator,
                    media: media
                };
                this.seaweedArray.push(new Seaweed(position, outerWorld));
                media.seaweed();
            }
        },
        createGeneratorThreshold: function() {
            let halfWindowSize = this.generatorSpeed * this.generatorDispersion;
            let randomShift = -halfWindowSize + 2 * halfWindowSize * Math.random();
            return this.generatorSpeed + randomShift;
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
                seaweedGenerator: seaweedGenerator,
                media: media
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
        pressed: true,
        create: function() {
            let el = document.createElement('button');
            el.className = 'audiomute off';
            el.onclick = function() {
                audioMuteBtn.pressed = !audioMuteBtn.pressed;
                el.className = 'audiomute ' + (audioMuteBtn.pressed ? 'off' : 'on');

                media.muted = audioMuteBtn.pressed;
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