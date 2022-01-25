let Seaweed = function(x, y) {
    this.position = {};
    this.position.x = x;
    this.position.y = y;

    this.el = document.createElement('div');
    this.el.className = 'seaweed';
    this.el.style.height = this.height;
    this.el.style.width = this.width;

    this.doRedraw();
    document.body.appendChild(this.el);
}

Seaweed.prototype = {
    height: 16,
    width: 16,
    doRedraw: function() {
        this.el.style.left = this.position.x - this.width / 2;
        this.el.style.top = this.position.y - this.height / 2;
    }
}