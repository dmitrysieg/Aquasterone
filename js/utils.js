let Utils = function() {
}

Utils.prototype = {
    // Math methods
    generateRandomVector: function(maxValue, minValue) {
        let angle = 2.0 * Math.PI * Math.random();
        let value = (minValue || 0.0) + (maxValue - (minValue || 0.0)) * Math.random();
        return {
            x: value * Math.cos(angle),
            y: value * Math.sin(angle)
        };
    },

    // Document methods
    initElement: function(name, h, w) {
        let el = document.createElement('div');
        el.className = name;
        el.style.height = h;
        el.style.width = w;
        return el;
    },
    generateRandomPosition: function(object) {
        return {
            x: (object.width / 2) + Math.random() * (document.body.clientWidth - object.width),
            y: (object.height / 2) + Math.random() * (document.body.clientHeight - object.height)
        }
    }
}

Utils = new Utils();