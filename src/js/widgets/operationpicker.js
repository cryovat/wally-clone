(function (global) {
    "use strict";

    if (typeof (global.window._) !== "function") {
        throw new Error("Underscore.js not found");
    }

    if (!global.window._.isObject(global.window.Warry)) {
        throw new Error("Operation Picker widget loaded before main Warry module");
    }

    var w = global.window,
        _ = w._,
        main = w.Warry;

    main.addWidgetType("operationpicker", function (element) {

        var ops = main.getService("operations"), changing = false;

        _.each(ops.getAvailable(), function (name) {

            var option = document.createElement("option");
            option.value = name;
            option.text = name;
            element.options.add(option);

        });

        element.addEventListener("change", function (e) {

            if (!changing) {
                ops.setActive(element.value);
            }

        });

        ops.addEventListener("operationchanged", function (e) {

            changing = true;
            element.value = e.name;
            changing = false;

        });

    });

}(this));