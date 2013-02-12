(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("History widget loaded before main Warry module");
    }

    main.addWidgetType("historybox", function (select) {

        var tile = main.getService("tile");



    });

}(this.Warry));