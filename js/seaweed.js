let Seaweed = function(position, outerWorld) {

    this.outerWorld = outerWorld;

    this.position = position;
    this.age = 0;
    this.el = Utils.initElement('seaweed', this.height, this.width);

    this.doRedraw();
    document.body.appendChild(this.el);
}

Seaweed.prototype = {
    height: 16,
    width: 16,
    foodValue: 15,
    lifetime: 30 * 1000,

    doLive: function(dt) {
        let newAge = this.age + dt;
        if (newAge >= this.lifetime) {
            this.outerWorld.seaweedGenerator.doRemoveObject(this);
            return;
        }
        this.setAge(newAge);
    },

    doRedraw: function() {
        this.el.style.left = this.position.x - this.width / 2;
        this.el.style.top = this.position.y - this.height / 2;
    },

    setAge: function(age) {
        this.age = age;
        this.el.style.filter = 'sepia(' + this.age / this.lifetime + ')';
    }
}