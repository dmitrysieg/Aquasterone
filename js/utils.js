let Utils = {

    // Math methods
    addSaturate: function(source, value, max) {
        let result = source + value;
        return result > max ? max : result;
    },
    generateRandomScalar: function(min, max) {
        return min + (max - min) * Math.random();
    },
    generateRandomVectorAngle: function(value) {
        let angle = 2.0 * Math.PI * Math.random();
        return {
            x: value * Math.cos(angle),
            y: value * Math.sin(angle)
        };
    },
    generateRandomVector: function(maxValue, minValue) {
        let value = this.generateRandomScalar(minValue || 0.0, maxValue);
        return this.generateRandomVectorAngle(value);
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
    getVectorDegree: function(v) {
        if (Math.abs(v.x) < 1e-5) {
            return v.y > 0 ? 90 : -90;
        } else {
            let rad = Math.atan(v.y / v.x);
            let deg = rad / Math.PI * 180;
            if (v.x < 0) {
                deg += 180;
            }
            return Math.floor(deg);
        }
    },

    // Both subject and object must have position.
    createDirectionalVector: function(subject, object, value) {
        let targetDistance = Utils.distance(subject.position, object.position);
        return {
            x: (object.position.x - subject.position.x) / targetDistance * value,
            y: (object.position.y - subject.position.y) / targetDistance * value
        };
    },

    // subject.position must exist
    // array[i].position must exist
    findNearestObject: function(subject, array, filteredProperty) {

        if (array.length <= 0) {
            return null;
        }

        let min_d2 = Number.POSITIVE_INFINITY;
        let min_target = null;
        for (i = 0, l = array.length; i < l; i++) {

            if (array[i][filteredProperty]) {
                continue;
            }

            let d2 = Utils.distance2(subject.position, array[i].position);
            if (d2 < min_d2) {
                min_d2 = d2;
                min_target = array[i];
            }
        }

        // Not found anything, except eaten objects
        if (!min_target) {
            return null
        } else {
            return {
                d2: min_d2,
                target: min_target
            }
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
    addStatusBar: function(el) {
        let statusBar = document.createElement('div');
        statusBar.className = 'statusBar';
        el.appendChild(statusBar);

        let emptyBar = document.createElement('div');
        emptyBar.className = 'empty';
        statusBar.appendChild(emptyBar);

        let fullBar = document.createElement('div');
        fullBar.className = 'full';
        statusBar.appendChild(fullBar);
        return fullBar;
    },
    generateRandomPosition: function(object) {
        return {
            x: (object.width / 2) + Math.random() * (document.body.clientWidth - object.width),
            y: (object.height / 2) + Math.random() * (document.body.clientHeight - object.height)
        }
    }
}