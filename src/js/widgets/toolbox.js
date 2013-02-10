(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Cursor module loaded before main Warry module");
    }

    main.addWidgetType("toolbox", function (element) {

        var tools = main.getService("tools"), changing = false;

        _.each(tools.getTools(), function (name) {

            var option = document.createElement("option");
            option.value = name;
            option.label = name;
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

}(this.Warry));