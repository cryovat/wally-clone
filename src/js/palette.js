(function (main) {
    "use strict";

    if (typeof (_) !== "function") {
        throw new Error("Underscore.js not found");
    }

    if (!_.isObject(main)) {
        throw new Error("Viewport module loaded before main Warry module");
    }

    var palette = {

        entries: [
            { r: 0, g: 0, b: 0, a: 0 },
            { r: 255, g: 255, b: 255, a: 0}
        ],
        currentIndex: 0,

        getColorCount: function () {

            return palette.entries.length;

        },

        getColor: function (index) {

            if (!_.isNumber(index)) {
                throw new TypeError("Expected number for palette index, got " + typeof (index));
            }

            return palette.entries[index];

        },

        getSelectedColor: function (index) {

            return palette.getColor(palette.selectedIndex);

        },

        setSelectedColor: function (index) {

            if (!_.isNumber(index)) {
                throw new TypeError("Expected number for palette index, got " + typeof (index));
            }

            palette.currentIndex = index;

            main.broadcast("palette.colorSelected", palette.getColor(palette.currentIndex));

        }

    };

    main.addService("palette", {

        getColorCount: palette.getColorCount,
        getColor: palette.getColor,
        getSelectedColor: palette.getSelectedColor,
        setSelectedColor: palette.setSelectedColor

    });

}(Warry));