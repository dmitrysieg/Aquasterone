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
    distance: function(p1, p2) {
        return Math.sqrt(Utils.distance2(p1, p2));
    },
    distance2: function(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    },
    getVectorValue: function(v) {
        return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
    },
    // subject.position must exist
    // array[i].position must exist
    findNearestObject: function(subject, array) {

        if (array.length <= 0) {
            return null;
        }

        let min_d2 = Number.POSITIVE_INFINITY;
        let min_target = null;
        for (i = 0, l = array.length; i < l; i++) {
            let d2 = Utils.distance2(subject.position, array[i].position);
            if (d2 < min_d2) {
                min_d2 = d2;
                min_target = array[i];
            }
        }
        return {
            d2: min_d2,
            target: min_target
        }
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