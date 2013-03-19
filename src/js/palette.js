(function (global) {
    "use strict";

    if (typeof (global.window._) !== "function") {
        throw new Error("Underscore.js not found");
    }

    if (!global.window._.isObject(global.window.Warry)) {
        throw new Error("Palette service loaded before main Warry module");
    }

    var w = global.window,
        _ = w._,
        main = w.Warry;

    main.createService("palette", function () {

        var that = this,
            palette = {

                // From http://androidarts.com/palette/16pal.htm
                entries: [
                    { r: 0,   g: 0,   b: 0,   a: 255 },
                    { r: 157, g: 157, b: 157, a: 255 },
                    { r: 255, g: 255, b: 255, a: 255 },
                    { r: 190, g:  38, b:  51, a: 255 },
                    { r: 224, g: 111, b: 139, a: 255 },
                    { r:  73, g:  60, b:  43, a: 255 },
                    { r: 164, g: 100, b:  34, a: 255 },
                    { r: 235, g: 137, b:  49, a: 255 },
                    { r: 247, g: 226, b: 107, a: 255 },
                    { r:  47, g:  72, b:  78, a: 255 },
                    { r:  68, g: 137, b:  26, a: 255 },
                    { r: 163, g: 206, b:  39, a: 255 },
                    { r:  27, g:  38, b:  50, a: 255 },
                    { r:   0, g:  87, b: 132, a: 255 },
                    { r:  49, g: 162, b: 242, a: 255 },
                    { r: 178, g: 220, b: 239, a: 255 },
                    { r: 255, g:   0, b: 255, a: 255 }
                ],
                currentIndex: 0,

                getColorCount: function () {

                    return palette.entries.length;

                },

                getColor: function (index) {

                    if (!_.isFinite(index)) {
                        throw new TypeError("Expected number for palette index, got " + typeof (index));
                    }

                    return palette.entries[index];

                },

                eachColor: function (func) {

                    if (!_.isFunction(func)) {
                        throw new TypeError("Expected function for palette iterator, got " + typeof (func));
                    }

                    _.each(palette.entries, func);
                },

                isValidIndex: function (index) {

                    if (!_.isFinite(index)) {
                        throw new TypeError("Expected number for palette index, got " + typeof (index));
                    }

                    if (palette.entries.length === 0) {
                        return false;
                    }

                    return (0 <= index && index < palette.entries.length);
                },

                getSelectedIndex: function () {
                    return palette.currentIndex;
                },

                getSelectedColor: function () {
                    return palette.getColor(palette.currentIndex);
                },

                setSelectedIndex: function (index) {

                    if (!_.isFinite(index)) {
                        throw new TypeError("Expected number for palette index, got " + typeof (index));
                    }

                    palette.currentIndex = index;

                    that.fireEvent("colorselected", { index: index });

                },

                withSelectedColor: function (func) {

                    if (!_.isFunction(func)) {
                        throw new TypeError("Expected function, got " + typeof (func));
                    }

                    func(palette.entries[palette.currentIndex]);
                },

                addHsl: function (color) {

                    var r = color.r / 255,
                        b = color.b / 255,
                        g = color.g / 255,
                        min = Math.min(r, Math.min(g, b)),
                        max = Math.max(r, Math.max(g, b)),
                        lum = (max + min) / 2,
                        sat = 0,
                        hue = 0;

                    if (max !== min) {
                        if (lum < 0.5) {
                            sat = (max - min) / (max + min);
                        } else {
                            sat = (max - min) / (2.0 - max - min);
                        }

                        if (max === r) {
                            hue = (g - b) / (max - min);
                        } else if (max === g) {
                            hue = 2.0 + (b - r) / (max - min);
                        } else {
                            hue = 4.0 + (r - g) / (max - min);
                        }

                        hue = hue * 60;

                        if (hue < 0) {
                            hue += 360;
                        }
                    }

                    color.hue = hue;
                    color.sat = sat;
                    color.lum = lum;
                },

                findDistance: function (c1, c2) {

                    return Math.sqrt(Math.pow(c1.hue - c2.hue, 2) + Math.pow(c1.sat - c2.sat, 2) + Math.pow(c1.lum - c2.lum, 2));

                },

                findClose: function (color, greater) {

                    var possible = _.first(_.sortBy(
                            _.filter(palette.entries, function (other) {
                                return (greater ? color.lum < other.lum : color.lum > other.lum);
                            }),
                            function (other) {
                                return palette.findDistance(color, other);
                            }
                        ));

                    return possible || color;

                },

                closestFromRgb: function (r, g, b, greater) {

                    var color = { r: r, g: g, b: b};
                    palette.addHsl(color);

                    return _.clone(palette.findClose(color, greater));
                }

            };

        _.each(palette.entries, function (c) {
            palette.addHsl(c);
        });

        that.getColorCount = palette.getColorCount;
        that.getColor = palette.getColor;
        that.eachColor = palette.eachColor;
        that.isValidIndex = palette.isValidIndex;
        that.getSelectedIndex = palette.getSelectedIndex;
        that.setSelectedIndex = palette.setSelectedIndex;
        that.getSelectedColor = palette.getSelectedColor;
        that.withSelectedColor = palette.withSelectedColor;
        that.closestFromRgb = palette.closestFromRgb;

    });

}(this));