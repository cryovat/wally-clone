(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("History widget loaded before main Warry module");
    }

    main.addWidgetType("historybox", function (select) {

        var history = main.getService("history");

        window.x = select;

        history.addEventListener("actionadded", function (e) {

            var option = document.createElement("option");

            option.value = select.length;
            option.text = e.action.toString();

            select.add(option);
            select.selectedIndex = select.length - 1;

        });

        history.addEventListener("historyundo", function (e) {

            if (select.options.length > 0) {
                select.options.length -= 1;
                select.selectedIndex = select.length - 1;
            }

        });

        history.addEventListener("historyreset", function (e) {

            select.options.length = 0;

        });

    });

}(this.Warry));