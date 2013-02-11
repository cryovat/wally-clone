(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Tile mode widget loaded before main Warry module");
    }

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

}(this.Warry));