let Utils = {

// --------------------------------------
//               Constants
// --------------------------------------
    AMOUNT_ATTEMPT: 50,
    CLUSTER_DISTANCE_MIN: 2,
    CLUSTER_DISTANCE_MAX: 3,

// --------------------------------------
//             Math methods
// --------------------------------------
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
    getVectorValue2: function(v) {
        return Math.pow(v.x, 2) + Math.pow(v.y, 2);
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

    getNormalUnity: function(v) {
        if (this.getVectorValue2(v) < 1e-5) {
            return {x: 0, y: 0};
        } else {
            let value = this.getVectorValue(v);
            return {
                x: v.y / value,
                y: -v.x / value
            };
        }
    },

    // Mutable parameter
    multiplyScalar: function(v, s) {
        v.x *= s;
        v.y *= s;
        return v;
    },

    // Immutable parameter
    addVector: function(v1, v2) {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
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

// --------------------------------------
//            Object search
// --------------------------------------

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

    /**
     * @param array Must be non-empty.
     * @return Non-null element of array.
     */
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

// --------------------------------------
//           Document methods
// --------------------------------------
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

    /**
     * Document clip check
     */
    checkClip: function(position, halfSize) {
        return position.x >= halfSize &&
                position.x <= document.body.clientWidth - halfSize &&
                position.y >= halfSize &&
                position.y <= document.body.clientHeight - halfSize;
    },

// --------------------------------------
//         Position generation
// --------------------------------------
    generateRandomPosition: function(object) {
        return {
            x: (object.width / 2) + Math.random() * (document.body.clientWidth - object.width),
            y: (object.height / 2) + Math.random() * (document.body.clientHeight - object.height)
        }
    },

    /**
     * @param prototype Define distance distribution between source and new position.
     * @param position Source position
     * @return New position or null, if not succeeded to generate new position within clip.
     */
    generateRandomPositionNear: function(prototype, position) {
        let newPosition, acc = 0;
        do {
            let dv = this.generateRandomVector(prototype.height * this.CLUSTER_DISTANCE_MAX, prototype.height * this.CLUSTER_DISTANCE_MIN);
            newPosition = this.addVector(position, dv);
            acc++;
        } while (!this.checkClip(newPosition, prototype.height / 2) && acc <= this.AMOUNT_ATTEMPT);
        return newPosition;
    }
};

// --------------------------------------
//              Generators
// --------------------------------------

Utils.UniformAccumulator = function(speed, callable, subject) {
    this.acc = 0;
    this.speed = speed;

    this.subject = subject;
    this.callable = callable;
};

Utils.UniformAccumulator.prototype = {

    awaitOrAct: function(dt) {
        this.acc += dt;
        if (this.acc >= this.speed) {
            this.acc -= this.speed;
            this.callable.call(this.subject);
        }
    },

    updateSpeed: function(speed) {
        this.speed = speed;
    }
};

Utils.DispersionAccumulator = function(speed, dispersion, subject, callable) {
    this.acc = 0;
    this.speed = speed;
    this.dispersion = dispersion;

    this.subject = subject;
    this.callable = callable;
};

Utils.DispersionAccumulator.prototype = {

    awaitOrAct: function(dt) {

        if (!this.nextThreshold) {
            this.nextThreshold = this.createNextThreshold();
        }

        this.acc += dt;
        if (this.acc > this.nextThreshold) {
            this.acc -= this.nextThreshold;
            this.nextThreshold = this.createNextThreshold();

            this.callable.call(this.subject);
        }
    },
    createNextThreshold: function() {
        let halfWindowSize = this.speed * this.dispersion;
        let randomShift = -halfWindowSize + 2 * halfWindowSize * Math.random();
        return this.speed + randomShift;
    },
};