(function (global) {
    "use strict";

    if (typeof (global.window._) !== "function") {
        throw new Error("Underscore.js not found");
    }

    if (!global.window._.isObject(global.window.Warry)) {
        throw new Error("Mode Switcher widget loaded before main Warry module");
    }

    var w = global.window,
        _ = w._,
        main = w.Warry;

    main.addWidgetType("modeswitcher", function (checkbox) {

        var tile = main.getService("tile");

        checkbox.checked = tile.isRepeat();

        tile.addEventListener("repeatchanged", function (e) {

            if (checkbox.checked !== e.repeat) {
                checkbox.checked = e.repeat;
            }
        });

        checkbox.addEventListener("change", function (e) {

            if (tile.isRepeat() !== checkbox.checked) {
                tile.setRepeat(checkbox.checked);
            }

        });


    });

}(this));