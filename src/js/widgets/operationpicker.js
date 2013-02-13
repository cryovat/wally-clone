(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Operation picker widget loaded before main Warry module");
    }

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

}(this.Warry));