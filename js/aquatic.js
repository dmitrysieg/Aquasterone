let Aquatic = function(position, value, outerWorld) {

    this.outerWorld = outerWorld;

    this.value = value;
    this.position = position;
    this.velocity = Utils.generateRandomVector(this.height * 10, this.height * 2);
    this.delayBeforeThinkAcc = 0;

    this.el = Utils.initElement('aquatic', this.height, this.width);
    Utils.addStatusBar(this.el);

    this.doRedraw();
    document.body.appendChild(this.el);
}

Aquatic.prototype = {
    height: 32,
    width: 32,
    delayBeforeThinkThreshold: 2000,
    getSize2: function() {
        return Math.pow(this.height / 2, 2) + Math.pow(this.width / 2, 2);
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
        if (this.target && Utils.distance2(this.position, this.target.position) <= this.getSize2()) {
            this.doEat(this.target);
            this.target = null;
        }
    },
    doEat: function(object) {
        this.outerWorld.doRemoveObject(object);
    },
    doDecideThink: function(dt) {

        if (this.target) {
            return;
        }

        this.delayBeforeThinkAcc += dt;
        if (this.delayBeforeThinkAcc >= this.delayBeforeThinkThreshold) {
            this.delayBeforeThinkAcc -= this.delayBeforeThinkThreshold;
            this.doThink();
        }
    },
    doThink: function() {
        let nearest = Utils.findNearestObject(this, this.outerWorld.seaweedArray);
        if (!nearest) {
            return;
        }

        if (nearest.d2 <= this.getSize2()) {
            this.doEat(nearest.target);
            this.target = null;
            return;
        } else {
            // Set target
            this.target = nearest.target;
            // Modify velocity along the target
            let velocityValue = Utils.getVectorValue(this.velocity);
            let targetDistance = Utils.distance(this.position, nearest.target.position);
            this.velocity = {
                x: (nearest.target.position.x - this.position.x) / targetDistance * velocityValue,
                y: (nearest.target.position.y - this.position.y) / targetDistance * velocityValue
            }
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
            this.velocity.x = -this.velocity.x;
        }
        if (crashSide.y < 0 || crashSide.y > 0) {
            this.velocity.y = -this.velocity.y;
        }
    },
    doRedraw: function() {
        this.el.style.left = this.position.x - this.width / 2;
        this.el.style.top = this.position.y - this.height / 2;
    }
}