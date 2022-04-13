function animate(animation) {
    let startingInstant = performance.now();
    let progress = 0;
    console.log(animation)

    requestAnimationFrame(function animate() {
        let timeFraction = (performance.now() - startingInstant) / animation.duration;
        if (timeFraction > 1) timeFraction = 1;
        progress = animation.timingFunction.func(timeFraction);
        animation.draw(progress);
        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    })

    return true;
}

let timingFunctions = {
    linear: {
        name: 'linear',
        func: function (timeFraction) {
            return timeFraction;
        }
    },
    quad: {
        name: 'quad',
        func: function (timeFraction) {
            return Math.pow(timeFraction, 2);
        }
    },
    getNthPol: function (n) {
        return {
            name: 'getNthPol',
            func: function (timeFraction) {
                return Math.pow(timeFraction, n);
            }
        }
    },
    pseudoBounce: function (elasticity = .25, numOfBounces = 2, curveOrder = 2) {
        if (elasticity < 1){
            return {
                name: 'bounce',
                func: function(timeFraction) {
                    let factor = (1 - elasticity)/(elasticity + 1 - 2 * Math.pow(elasticity, numOfBounces + 1));
                    if (timeFraction <= factor){
                        return Math.pow(timeFraction/factor, curveOrder);
                    } else {
                        let bounceNum = 1;
                        let halfOfRange = factor * Math.pow(elasticity, 1);
                        let lowerlimit = factor;
                        let middlePoint = lowerlimit + halfOfRange;
                        let upperLimit = factor + 2 * halfOfRange;
                        while (true) {
                            if (lowerlimit < timeFraction && timeFraction <= upperLimit) {
                                break;
                            } else {
                                bounceNum++;
                            }
                            halfOfRange = factor * Math.pow(elasticity, bounceNum);
                            lowerlimit = upperLimit;
                            middlePoint = lowerlimit + halfOfRange;
                            upperLimit += 2 * halfOfRange;
                        }
                        if (timeFraction <= middlePoint) {
                            let positionInRange = timeFraction - lowerlimit;
                            return 1 - Math.pow(elasticity, bounceNum) * (1 - (Math.pow(1 - positionInRange/halfOfRange, curveOrder)));
                        } else {
                            let positionInRange = timeFraction - middlePoint;
                            return 1 + Math.pow(elasticity, bounceNum) * ((Math.pow(positionInRange/halfOfRange, curveOrder)) - 1);
                        }
                    }
                }
            }
        } else {
            console.error('elasticity must be less than 1')
        }
    }
}

let alterTF = {
    reverse: function (timing_function) {
        timingFunction = timing_function.func;
        timing_function.func =  function (timeFraction) {
            return timingFunction(1 - timeFraction);
        };
        return timing_function;
    },
    easeOut: function (timing_function) {
        timingFunction = timing_function.func;
        timing_function.func = function (timeFraction) {
            return 1 - (timingFunction(1 - timeFraction));
        };
        return timing_function;
    },
    easeInOut: function (timing_function) {
        timingFunction = timing_function.func;
        timing_function.func =  function (timeFraction) {
            if (timeFraction <= 0.5) {
                return timingFunction(2 * timeFraction) / 2;
            } else {
                return (2 - timingFunction(2 - 2 * timeFraction)) / 2;
            }
        };
        return timing_function;
    }
}