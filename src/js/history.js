(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("History serivce loaded before main Warry module");
    }

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

}(Warry));