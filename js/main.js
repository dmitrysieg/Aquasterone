(function() {

    let media = {
        muted: true,
        playSound: function(name) {
            if (!this.muted) {
                new Audio(name).play();
            }
        },
        bubble: function() {
            this.playSound('audio/bubble.wav');
        },
        seaweed: function() {
            //this.playSound('audio/seaweed.wav');
        },
        die: function() {
            this.playSound('audio/die.wav');
        },
        seaweedDie: function() {
            this.playSound('audio/seaweed_die.wav');
        }
    };

    let SeaweedGenerator = function() {
        this.generator = new Utils.DispersionAccumulator(
            this.generatorSpeed,
            this.generatorDispersion,
            this,
            this.doGenInternal
        );
    }

    SeaweedGenerator.prototype = {

        generatorSpeed: 50,
        generatorDispersion: 0.2,

        clusterGenerationProbability: 0.75,
        seaweedArray: [],

        doGen: function(dt) {
            this.generator.awaitOrAct(dt);
        },

        doGenInternal: function() {
            let position = this.doGenPosition2();

            let outerWorld = {
                seaweedGenerator: this,
                media: media
            };
            this.seaweedArray.push(new Seaweed(position, outerWorld));
            media.seaweed();
        },

        /**
         * Uniform distribution of grow position.
         */
        doGenPosition: function() {
            return Utils.generateRandomPosition(Seaweed.prototype);
        },

        /**
         * Experimental
         * Suppose that seaweed tend to grow near other seaweed, so it should generate clusters.
         */
        doGenPosition2: function() {
            if (this.seaweedArray.length > 0 && Math.random() <= this.clusterGenerationProbability) {
                let parent = Utils.getRandomElement(this.seaweedArray);
                let position = Utils.generateRandomPositionNear(Seaweed.prototype, parent.position);
                if (!position) {
                    return Utils.generateRandomPosition(Seaweed.prototype);
                } else {
                    return position;
                }
            } else {
                return Utils.generateRandomPosition(Seaweed.prototype);
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

    let AquaticGenerator = function(seaweedGenerator, media) {
        this.seaweedGenerator = seaweedGenerator;
        this.media = media;
    }

    AquaticGenerator.prototype = {
        aquaticArray: [],
        doGen: function() {

            let position = Utils.generateRandomPosition(Aquatic.prototype);

            let testosterone = Utils.generateRandomScalar(Aquatic.prototype.minTestosterone, Aquatic.prototype.maxTestosterone);
            let oxytocin = Utils.generateRandomScalar(Aquatic.prototype.minOxytocin, Aquatic.prototype.maxOxytocin);

            let outerWorld = {
                aquaticGenerator: this,
                seaweedGenerator: this.seaweedGenerator,
                media: this.media
            };
            let hormonal = {
                testosterone: testosterone,
                oxytocin: oxytocin
            };
            this.aquaticArray.push(new Aquatic(position, hormonal, outerWorld));
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

    seaweedGenerator = new SeaweedGenerator();
    aquaticGenerator = new AquaticGenerator(seaweedGenerator, media);

    for (let i = 0; i < 150; i++)
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