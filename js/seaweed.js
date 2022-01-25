let Seaweed = function(position) {
    this.position = position
    this.el = Utils.initElement('seaweed', this.height, this.width);

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