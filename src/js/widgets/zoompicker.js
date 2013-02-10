(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Cursor module loaded before main Warry module");
    }


    main.addWidgetType("zoompicker", function (element) {

        element.addEventListener("change", function (e) {



        });

    });

}(this.Warry));