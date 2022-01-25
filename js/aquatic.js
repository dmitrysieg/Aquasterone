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
    doMove: function(dt) {
        this.position.x = this.position.x + this.velocity.x * dt * 0.001;
        this.position.y = this.position.y + this.velocity.y * dt * 0.001;
        this.doRedraw();
    },
    doRedraw: function() {
        this.el.style.left = this.position.x - this.width / 2;
        this.el.style.top = this.position.y - this.height / 2;
    }
}