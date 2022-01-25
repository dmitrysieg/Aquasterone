let Aquatic = function(x, y, value) {

    this.value = value;

    this.el = document.createElement('div');
    this.el.className = 'aquatic';
    this.el.style.height = this.height;
    this.el.style.width = this.width;
    this.el.style.left = x - this.width / 2;
    this.el.style.top = y - this.height / 2;
    document.body.appendChild(this.el);
}

Aquatic.prototype = {
    height: 32,
    width: 32
}