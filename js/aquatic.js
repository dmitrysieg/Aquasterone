let Aquatic = function(position, hormonal, outerWorld) {

    this.outerWorld = outerWorld;

    this.el = Utils.initElement('aquatic', this.height, this.width);
    this.statusBar = Utils.addStatusBar(this.el);

    this.hormonal = hormonal;

    // Left-handed or right-handed creature.
    this.swarmOrientation = Math.random() > 0.5 ? 1 : -1;

    this.position = position;
    this.setVelocity(Utils.generateRandomVectorAngle(this.height * this.hormonal.testosterone));
    this.delayBeforeThinkAcc = 0;

    this.hunger = this.maxHunger;

    this.doRedraw();
    document.body.appendChild(this.el);
}

Aquatic.prototype = {
    height: 32,
    width: 32,
    maxHunger: 100,
    hungerSeekThreshold: 80,

    // Define speed and hierarchy position.
    minTestosterone: 3,
    maxTestosterone: 13,

    // Define how close to another creature can it swim.
    minOxytocin: 0.2,
    maxOxytocin: 1.4,

    delayBeforeThinkThreshold: 2000,

    // Speed of decreasing hunger per sec
    appetite: 2,

    getSize2: function() {
        return Math.pow(this.height / 2, 2) + Math.pow(this.width / 2, 2);
    },

    /* ------------------------------------------------------------------------------------------------------------- */

    doLive: function(dt) {
        // trying to stay alive
        if (!this.doOrganismFunctions(dt)) {
            return;
        }
        this.doDecideThink(dt);
        this.doMoveSmart(dt);
    },

    /* ------------------------------------------------------------------------------------------------------------- */

    // return true if stay alive, false otherwise.
    doOrganismFunctions: function(dt) {

        // Hunger
        let newHunger = this.hunger - (dt / 1000) * this.appetite;
        if (newHunger <= 0) {
            this.doDie();
            return false;
        }

        this.setHunger(newHunger);
        return true;
    },

    doDie: function() {
        this.outerWorld.aquaticGenerator.doRemoveObject(this);
        this.outerWorld.media.die();
    },

    doMoveSmart: function(dt) {
        let crashSide;
        crashSide = this.doMove(dt);
        if (crashSide) {
            this.tryModifyVelocity(crashSide);
        }

        this.doCheckTarget();

        this.doRedraw();
    },
    doCheckTarget: function() {
        if (this.targetBehavior === 'seek' &&
                this.target &&
                !this.target.eaten &&
                Utils.distance2(this.position, this.target.position) <= this.getSize2()) {
            this.doEat(this.target);
        }
    },
    doEat: function(object) {
        if (object.hunger) {
            console.warn(object);
        }
        this.setHunger(Utils.addSaturate(this.hunger, object.foodValue, this.maxHunger));
        this.outerWorld.seaweedGenerator.doRemoveObject(object);
        this.outerWorld.media.bubble();

        object.eaten = true;
        this.target = null;
    },

    doDecideThink: function(dt) {

        if (this.hunger > this.hungerSeekThreshold) {
            this.doSwarm(dt);
        } else {
            this.doSeek(dt);
        }
    },

    doSwarm: function(dt) {
        this.targetBehavior = 'swarm';
        if (!this.target) {
            this.target = this.chooseSwarmTarget();
        }

        this.doAlterDirection(this.target);
    },
    chooseSwarmTarget: function() {

        let weakerDiff = Number.POSITIVE_INFINITY;
        let weakerDiffTarget = null;

        this.outerWorld.aquaticGenerator.aquaticArray.forEach(a => {
            let diff = a.hormonal.testosterone - this.hormonal.testosterone;
            if (diff > 0 && weakerDiff > diff) {
                weakerDiff = diff;
                weakerDiffTarget = a;
            }
        });

        return weakerDiffTarget;
    },
    doAlterDirection: function(target) {
        if (target) {
            let factor = this.height * this.hormonal.oxytocin * this.swarmOrientation;
            let vectorAlong = Utils.multiplyScalar(Utils.getNormalUnity(target.velocity), factor);
            let pointAlong = {
                position: Utils.addVector(target.position, vectorAlong)
            };
            this.setVelocityAlong(pointAlong);
        } else {
            // so far nothing. choose random direction here;
        }
    },

    // Thinking regardless of target presence.
    // Can review target while having target.
    doSeek: function(dt) {

        // Stop thinking of your master
        if (this.targetBehavior === 'swarm') {
            this.target = null;
        }
        this.targetBehavior = 'seek';

        // make aquatic to think faster when hungry
        let actual_beforeThink_threshold = this.delayBeforeThinkThreshold * (this.hunger / 100);

        this.delayBeforeThinkAcc += dt;
        if (this.delayBeforeThinkAcc >= actual_beforeThink_threshold) {
            this.delayBeforeThinkAcc = 0;
            this.doThink();
        }
    },
    doThink: function() {
        this.doTargetChoose();
    },

    doTargetChoose: function() {
        let nearest = Utils.findNearestObject(this, this.outerWorld.seaweedGenerator.seaweedArray, 'eaten');
        if (!nearest) {
            return;
        }

        if (nearest.d2 <= this.getSize2()) {
            this.target = nearest.target;
            this.doEat(nearest.target);
            return;
        } else {

            // Set target
            this.target = nearest.target;

            // Modify velocity along the target
            this.setVelocityAlong(nearest.target);
        }
    },

    doMove: function(dt) {
        let crashSideX = 0, crashSideY = 0;

        let newX = this.position.x + this.velocity.x * dt * 0.001;
        let newY = this.position.y + this.velocity.y * dt * 0.001;

        if (newX < this.width / 2) {crashSideX = -1;}
        if (newX > document.body.clientWidth - this.width / 2) {crashSideX = 1;}

        if (newY < this.height / 2) {crashSideY = -1;}
        if (newY > document.body.clientHeight - this.height / 2) {crashSideY = 1;}

        if (crashSideX != 0 || crashSideY != 0) {
            return {x: crashSideX, y: crashSideY}
        } else {
            this.position.x = newX;
            this.position.y = newY;
            return null;
        }
    },
    tryModifyVelocity: function(crashSide) {
        if (crashSide.x < 0 || crashSide.x > 0) {
            this.setVelocity({x: -this.velocity.x, y: this.velocity.y});
        }
        if (crashSide.y < 0 || crashSide.y > 0) {
            this.setVelocity({x: this.velocity.x, y: -this.velocity.y});
        }
    },
    doRedraw: function() {
        this.el.style.left = this.position.x - this.width / 2;
        this.el.style.top = this.position.y - this.height / 2;
    },

    setVelocity: function(v) {
        this.velocity = v;
        this.el.style.transform = 'rotate(' + Utils.getVectorDegree(v) + 'deg)';
    },
    setVelocityAlong: function(target) {
        this.setVelocity(Utils.createDirectionalVector(this, target, Utils.getVectorValue(this.velocity)));
    },
    setHunger: function(hunger) {
        this.hunger = hunger;
        this.statusBar.style.width = hunger + '%';
    }
}