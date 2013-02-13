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

                clear: function (action) {

                    history.actions.length = 0;

                    that.fireEvent("historyreset", {});

                },

                replayFromStart: function (source, dest) {

                    _.each(history.actions, function (action) {
                        action.applyAction(source, dest);
                    });

                }

            };

        tile.addEventListener("imagechanged", function (e) {

            history.clear();

        });

        that.addAction = history.addAction;
        that.replayFromStart = history.replayFromStart;

    });

}(Warry));