(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Cursor module loaded before main Warry module");
    }


    main.addWidgetType("zoompicker", function (element) {

        var tile = main.getService("tile"), changing = false;

        _.each(tile.getZoomLevels(), function (level) {

            var option = document.createElement("option");
            option.value = level;
            option.label = (level * 100) + "%";
            element.options.add(option);
        });

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

}(this.Warry));