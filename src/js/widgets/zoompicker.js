(function (global) {
    "use strict";

    if (typeof (global.window._) !== "function") {
        throw new Error("Underscore.js not found");
    }

    if (!global.window._.isObject(global.window.Warry)) {
        throw new Error("Zoompicker widget loaded before main Warry module");
    }

    var w = global.window,
        _ = w._,
        main = w.Warry;

    main.addWidgetType("zoompicker", function (element) {

        var tile = main.getService("tile"),
            changing = false;

        _.each(tile.getZoomLevels(), function (level) {
            var option = document.createElement("option");
            option.value = level;
            option.text = (level * 100) + "%";
            element.options.add(option);
        });

        element.value = tile.getZoom();

        element.addEventListener("change", function (e) {

            if (!changing) {
                changing = true;
                tile.setZoom(parseInt(element.value, 10));
                changing = false;
            }

        });

        tile.addEventListener("zoomchanged", function (e) {

            if (!changing) {
                changing = true;
                element.value = e.zoom;
                changing = false;
            }

        });

    });

}(this));