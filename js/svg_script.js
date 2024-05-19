var settings = [
  { // shapes multy   
    scale: true,
    rotate: true,
    repulsion: true,
  },
  { // Live
    repulsion: true,
    repulsionDistance: 500,
    repulsionPower: 30,
  },  
  { // Bags
    repulsion: true,
  },  
  { // Letters
    scale: true,
    rotate: true,
    repulsion: true,
  }
];

$(function() {
  App = {};
  App.chaos = [];

  $('svg').each(function(i) {
    App.chaos.push(new Chaos(this, settings[i]));
  });
});

function Chaos(container, options) {
    if (this instanceof Chaos) {
        this.defaults = {
            items: 'path, polygon, polyline, line, circle, rect',
            duration: 1.5,
            scale: false,
            scaleMax: 2,
            scaleDistance: 33, // % of width
            rotate: false,
            rotateDistance: 42, // % of width
            rotateDegPerFrame: 2,
            rotateRandDir: true,
            repulsion: false,
            repulsionDistance: 45, // % of width
            repulsionPower: 60,
            hue: false,
            hueRandDir: false,
            hueDistance: 50, // % of width
            hueMaxShift: 90
        };

        this.options = $.extend(true, {}, this.defaults, options);

        this.container = $(container);
        if (!this.container.length) return;

        this.items = this.container.find(this.options.items);
        if (!this.items.length) return;

        this.ticking = false;
        this.mouseX = 0;
        this.mouseY = 0;

        return this.init();
    }
}

Chaos.prototype = {
    constructor: Chaos,

    init: function() {
        this.resize();
        this.overrideOptionsFromElementData();
        this.prepare();
        this.attachEvents();
        return this;
    },

    overrideOptionsFromElementData: function() {
        for (var i in this.defaults) {
            if (this.defaults.hasOwnProperty(i)) {
                var optionName = i;

                var dataAttrName = 'chaos' + optionName.charAt(0).toUpperCase() + optionName.slice(1);
                var value = this.container.data(dataAttrName);

                if (typeof value !== 'undefined' && value !== null) {
                    //console.log('Chaos option "' + optionName + '" was overriden from element attribute with value: ' + value);
                    this.options[optionName] = value;
                }
            }
        }
    },

    prepare: function() {
        var C = this;

        this.container.css({
            overflow: 'visible'
        });

        TweenLite.set(this.items, {
            // rotation: 0,
            scale: 1
        });

        if (this.options.rotateRandDir) {
            this.items.each(function() {
                if (Math.random() > 0.5) {
                    this._chaosRotateDir = 1;
                }
                else {
                    this._chaosRotateDir = -1;
                }
                this._chaosRotate = this._gsTransform.rotation;
            });
        }

        if (C.options.hue) {
            this.items.each(function() {
                var colorInitial = $(this).css('fill');
                this._chaosColorInitial = colorInitial;

                var rgb = parseColor(colorInitial);
                var hsl = rgb2Hsl(rgb);
                this._chaosColorH = hsl[0];
                this._chaosColorS = hsl[1];
                this._chaosColorL = hsl[2];

                if (C.options.hueRandDir) {
                    if (Math.random() > 0.5) {
                        this._chaosHueDir = 1;
                    }
                    else {
                        this._chaosHueDir = -1;
                    }
                }
            });
        }
    },

    update: function() {
        var C = this;
        this.items.each(function(i) {
            var thisRect = this.getBoundingClientRect();
            var distanceX = thisRect.left + thisRect.width / 2 - C.mouseX;
            var distanceY = thisRect.top + thisRect.height / 2 - C.mouseY;
            var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            var transforms = {
                transformOrigin: "50% 50%"
            };

            if (C.options.repulsion) {
                transforms.x = 0;
                transforms.y = 0;

                if (distance < C.repulsionDistancePx) {
                    var factor = C.options.repulsionPower / C.repulsionDistancePx;
                    var angle = Math.atan2(distanceY, distanceX);

                    transforms.x = (Math.cos(angle) * C.repulsionDistancePx - distanceX) * factor;
                    transforms.y = (Math.sin(angle) * C.repulsionDistancePx - distanceY) * factor;
                }
            }

            if (C.options.scale) {
                transforms.scale = 1;

                if (distance < C.scaleDistancePx) {
                    var k = (C.options.scaleMax - 1) / C.scaleDistancePx;
                    transforms.scale = C.options.scaleMax - distance * k;
                }
            }

            if (C.options.rotate) {
                if (distance < C.rotateDistancePx) {
                    var rotate = this._chaosRotate;

                    if (!rotate) rotate = 0;

                    var rotationIncrement = (C.options.rotateRandDir && this._chaosRotateDir == -1)
                        ? -C.options.rotateDegPerFrame
                        : C.options.rotateDegPerFrame;

                    rotate = rotate * 1 + rotationIncrement;
                    this._chaosRotate = rotate;

                    transforms.rotation = rotate;
                }
            }

            if (C.options.hue) {
                if (distance < C.hueDistancePx) {
                    var effectPower = (C.hueDistancePx - distance) / C.hueDistancePx;
                    var h;

                    if (C.options.hueRandDir && this._chaosHueDir == -1) {
                        h = this._chaosColorH - C.options.hueMaxShift * effectPower;
                    } else {
                        h = this._chaosColorH + C.options.hueMaxShift * effectPower;
                    }

                    var fillRgb = hsl2Rgb(h, this._chaosColorS / 100, this._chaosColorL / 100);
                    transforms.fill = 'rgb(' + fillRgb[0] + ',' + fillRgb[1] + ',' + fillRgb[2] + ')';
                } else {
                    transforms.fill = this._chaosColorInitial;
                }
            }

            TweenLite.killTweensOf(this);
            TweenLite.to(this, C.options.duration, transforms);
        });

        this.ticking = false;
    },

    pointerMove: function(e) {
        if (!this.ticking) {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            requestAnimationFrame($.proxy(this.update, this));
            this.ticking = true;
        }
    },

    pointerLeave: function() {
        var C = this;
        TweenLite.killTweensOf(C.items);

        TweenLite.to(C.items, C.options.duration, {
            scale: 1,
            transformOrigin: "50% 50%",
            x: 0,
            y: 0
        });

        if (C.options.hue) {
            C.items.each(function(i) {
                TweenLite.to(this, C.options.duration, {
                    fill: this._chaosColorInitial
                });
            });
        }
    },

    resize: function() {
        this.width = this.container.width();
        this.repulsionDistancePx = this.options.repulsionDistance * this.width / 100;
        this.scaleDistancePx = this.options.scaleDistance * this.width / 100;
        this.rotateDistancePx = this.options.rotateDistance * this.width / 100;
        this.hueDistancePx = this.options.hueDistance * this.width / 100;
    },

    attachEvents: function() {
        this.container.on('mousemove touchmove', $.proxy(this.pointerMove, this));
        this.container.on('mouseleave touchend', $.proxy(this.pointerLeave, this));
        $(window).on('resize', $.proxy(this.resize, this));
    }
};

function parseColor(input) {
    if (input.substr(0, 1) == "#") {
        var collen = (input.length - 1) / 3;
        var fact = [17, 1, 0.062272][collen - 1];
        return [
            Math.round(parseInt(input.substr(1, collen), 16) * fact),
            Math.round(parseInt(input.substr(1 + collen, collen), 16) * fact),
            Math.round(parseInt(input.substr(1 + 2 * collen, collen), 16) * fact)
        ];
    }
    else return input.split("(")[1].split(")")[0].split(",").map(Math.round);
}

function hsl2Rgb(hueOrHSL, saturation, lightness) {
    if (hueOrHSL == undefined) {
        return [0, 0, 0];
    }

    var hue;
    if (typeof hueOrHSL == "object") {
        lightness = hueOrHSL[2];
        saturation = hueOrHSL[1];
        hue = hueOrHSL[0];
    } else {
        hue = hueOrHSL;
    }

    if (hue >= 360) {
        hue = hue - 360;
    } else if (hue < 0) {
        hue = hue + 360;
    }

    if (typeof saturation == 'string' && saturation.indexOf('%') !== -1) {
        saturation = parseFloat(saturation);
        saturation /= 100;
    }

    if (typeof lightness == 'string' && lightness.indexOf('%') !== -1) {
        lightness = parseFloat(lightness);
        lightness /= 100;
    }

    var chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation;
    var huePrime = hue / 60;
    var secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

    huePrime = Math.floor(huePrime);
    var red;
    var green;
    var blue;

    if (huePrime === 0) {
        red = chroma;
        green = secondComponent;
        blue = 0;
    } else if (huePrime === 1) {
        red = secondComponent;
        green = chroma;
        blue = 0;
    } else if (huePrime === 2) {
        red = 0;
        green = chroma;
        blue = secondComponent;
    } else if (huePrime === 3) {
        red = 0;
        green = secondComponent;
        blue = chroma;
    } else if (huePrime === 4) {
        red = secondComponent;
        green = 0;
        blue = chroma;
    } else if (huePrime === 5) {
        red = chroma;
        green = 0;
        blue = secondComponent;
    }

    var lightnessAdjustment = lightness - (chroma / 2);
    red += lightnessAdjustment;
    green += lightnessAdjustment;
    blue += lightnessAdjustment;

    return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];
}

function rgb2Hsl(r, g, b) {
    if (typeof r == "object") {
        b = r[2];
        g = r[1];
        r = r[0];
    }

    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
}