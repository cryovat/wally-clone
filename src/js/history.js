(function (global) {
    "use strict";

    if (typeof (global.window._) !== "function") {
        throw new Error("Underscore.js not found");
    }

    if (!global.window._.isObject(global.window.Warry)) {
        throw new Error("History service loaded before main Warry module");
    }

    var w = global.window,
        _ = w._,
        main = w.Warry;

    main.createService("history", function () {

        var that = this,
            tile = main.getService("tile"),
            history = {

                actions: [],

                addAction: function (action) {

                    history.actions.push(action);

                    that.fireEvent("actionadded", { action: action, index: history.length - 1});

                },

                isEmpty: function () {
                    return (history.actions.length === 0);
                },

                clear: function (action) {

                    history.actions.length = 0;

                    that.fireEvent("historyreset", {});

                },

                undo: function () {

                    if (history.actions.length > 0) {
                        history.actions.length -= 1;
                    }

                    that.fireEvent("historyundo", {});
                },

                replayFromStart: function (source, dest) {

                    var a = source,
                        b = dest;

                    _.each(history.actions, function (action) {
                        var temp;

                        action.applyAction(a, b);

                        temp = a;
                        a = b;
                        b = a;
                    });

                    if (b === source) {
                        dest.set(b, 0);
                    }
                }

            };

        tile.addEventListener("imagechanged", function (e) {

            history.clear();

        });

        that.addAction = history.addAction;
        that.isEmpty = history.isEmpty;
        that.undo = history.undo;
        that.replayFromStart = history.replayFromStart;

    });

}(this));