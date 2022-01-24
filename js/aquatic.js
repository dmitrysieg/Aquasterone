var Aquatic = function(x, y) {
    this.el = document.createElement('div');
    this.el.className = 'aquatic';
    this.el.style.height = this.height;
    this.el.style.width = this.width;
    this.el.style.left = x;
    this.el.style.top = y;
    document.body.appendChild(this.el);
}

Aquatic.prototype = {
    height: 32,
    width: 32
}