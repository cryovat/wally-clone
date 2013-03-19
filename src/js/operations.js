(function (global) {
    "use strict";

    if (typeof (global.window._) !== "function") {
        throw new Error("Underscore.js not found");
    }

    if (!global.window._.isObject(global.window.Warry)) {
        throw new Error("Operations service loaded before main Warry module");
    }

    var w = global.window,
        _ = w._,
        main = w.Warry;

    main.createService("operations", function () {

        var that = this,
            palette = main.getService("palette"),
            closeop = function (greater) {
                return function (source, dest, idx) {

                    var i = idx * 4,
                        r = source[i],
                        g = source[i + 1],
                        b = source[i + 2],
                        c = palette.closestFromRgb(r, g, b, greater);

                    dest[i] = c.r;
                    dest[i + 1] = c.g;
                    dest[i + 2] = c.b;
                    dest[i + 3] = source[i + 3];
                };
            },
            ops = {

                available: ["overwrite", "lighten", "darken"],

                active: "overwrite",

                lighten: closeop(true),

                darken: closeop(false),

                getAvailable: function () {
                    return ops.available.slice(0);
                },

                setActive: function (name) {

                    if (!_.isString(name)) {
                        throw new TypeError("Operation name must be string, got " + typeof (name));
                    }

                    if (!_.contains(ops.available, name)) {
                        throw new Error("Unsupported operation: " + name);
                    }

                    ops.active = name;

                    that.fireEvent("operationchanged", { name: name });
                },

                getActive: function () {

                    var op, color;

                    if (ops.active === "lighten") {
                        op = ops.lighten;
                    } else if (ops.active === "darken") {
                        op = ops.darken;
                    }

                    if (!op) {

                        color = palette.getSelectedColor();

                        op = function (source, dest, idx) {
                            dest[idx * 4] = color.r;
                            dest[idx * 4 + 1] = color.g;
                            dest[idx * 4 + 2] = color.b;
                            dest[idx * 4 + 3] = color.a;
                        };
                    }

                    return op;
                }

            };

        that.getAvailable = ops.getAvailable;
        that.setActive = ops.setActive;
        that.getActive = ops.getActive;

    });
}(this));