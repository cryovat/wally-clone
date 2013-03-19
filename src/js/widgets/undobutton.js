(function (global) {
    "use strict";

    if (typeof (global.window._) !== "function") {
        throw new Error("Underscore.js not found");
    }

    if (!global.window._.isObject(global.window.Warry)) {
        throw new Error("Undobutton widget loaded before main Warry module");
    }

    var w = global.window,
        _ = w._,
        main = w.Warry;

    main.addWidgetType("undobutton", function (button) {

        var history = main.getService("history");

        history.addEventListener("actionadded", function (e) {
            button.disabled = false;
        });

        history.addEventListener("historyundo", function (e) {
            button.disabled = history.isEmpty();
        });

        history.addEventListener("historyreset", function (e) {
            button.disabled = history.isEmpty();
        });

        button.addEventListener("click", function (e) {
            history.undo();
        });

    });

}(this));