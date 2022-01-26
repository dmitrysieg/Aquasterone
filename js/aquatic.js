let Aquatic = function(position, value, outerWorld) {

    this.outerWorld = outerWorld;

    this.value = value;
    this.position = position;
    this.velocity = Utils.generateRandomVector(this.height * 10, this.height * 2);
    this.delayBeforeThinkAcc = 0;

    this.el = Utils.initElement('aquatic', this.height, this.width);

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
            this.outerWorld.doRemoveObject(this.target);
            this.target = null;
        }
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
        if (this.outerWorld.seaweedArray.length <= 0) {
            return;
        }

        let min_d2 = Number.POSITIVE_INFINITY;
        let min_target = null;
        for (i = 0, l = this.outerWorld.seaweedArray.length; i < l; i++) {
            let d2 = Utils.distance2(this.position, this.outerWorld.seaweedArray[i].position);
            if (d2 < min_d2) {
                min_d2 = d2;
                min_target = this.outerWorld.seaweedArray[i];
            }
        }

        if (min_d2 <= this.getSize2()) {
            this.doEat(min_target);
            this.target = null;
            return;
        } else {
            // Set target
            this.target = min_target;
            // Modify velocity along the target
            let velocityValue = Utils.getVectorValue(this.velocity);
            let targetDistance = Utils.distance(this.position, min_target.position);
            this.velocity = {
                x: (min_target.position.x - this.position.x) / targetDistance * velocityValue,
                y: (min_target.position.y - this.position.y) / targetDistance * velocityValue
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