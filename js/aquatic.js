let generateRandomVector = function(maxValue, minValue) {
    let angle = 2.0 * Math.PI * Math.random();
    let value = (minValue || 0.0) + (maxValue - (minValue || 0.0)) * Math.random();
    return {
        x: value * Math.cos(angle),
        y: value * Math.sin(angle)
    };
}

let Aquatic = function(x, y, value) {

    this.value = value;

    this.position = {};
    this.position.x = x;
    this.position.y = y;

    this.velocity = generateRandomVector(this.height * 10, this.height * 2);

    this.el = document.createElement('div');
    this.el.className = 'aquatic';
    this.el.style.height = this.height;
    this.el.style.width = this.width;

    this.doRedraw();
    document.body.appendChild(this.el);
}

Aquatic.prototype = {
    height: 32,
    width: 32,
    doMoveSmart: function(dt) {
        let crashSide;
        crashSide = this.doMove(dt);
        if (crashSide) {
            this.tryModifyVelocity(crashSide);
        }
        this.doRedraw();
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