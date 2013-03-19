(function (global) {
    "use strict";

    if (typeof (global.window._) !== "function") {
        throw new Error("Underscore.js not found");
    }

    if (!global.window._.isObject(global.window.Warry)) {
        throw new Error("Toolbox widget loaded before main Warry module");
    }

    var w = global.window,
        _ = w._,
        main = w.Warry;

    main.addWidgetType("toolbox", function (element) {

        var tools = main.getService("tools"), changing = false;

        _.each(tools.getTools(), function (name) {

            var option = document.createElement("option");
            option.value = name;
            option.text = name;
            element.options.add(option);

        });

        element.addEventListener("change", function (e) {

            if (!changing) {
                tools.setCurrent(element.value);
            }

        });

        tools.addEventListener("toolchanged", function (e) {

            changing = true;
            element.value = e.name;
            changing = false;

        });

    });

}(this));