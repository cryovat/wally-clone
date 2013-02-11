(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Palette serivce loaded before main Warry module");
    }

    main.createService("palette", function () {

        var that = this,
            palette = {

                // From http://androidarts.com/palette/16pal.htm
                entries: [
                    { r: 0,   g: 0,   b: 0,   a: 255 },
                    { r: 157, g: 157, b: 157, a: 255 },
                    { r: 255, g: 255, b: 255, a: 255 },
                    { r: 190, g:  38, b:  51, a: 255 },
                    { r: 224, g: 111, b: 139, a: 255 },
                    { r:  73, g:  60, b:  43, a: 255 },
                    { r: 164, g: 100, b:  34, a: 255 },
                    { r: 235, g: 137, b:  49, a: 255 },
                    { r: 247, g: 226, b: 107, a: 255 },
                    { r:  47, g:  72, b:  78, a: 255 },
                    { r:  68, g: 137, b:  26, a: 255 },
                    { r: 163, g: 206, b:  39, a: 255 },
                    { r:  27, g:  38, b:  50, a: 255 },
                    { r:   0, g:  87, b: 132, a: 255 },
                    { r:  49, g: 162, b: 242, a: 255 },
                    { r: 178, g: 220, b: 239, a: 255 },
                    { r: 255, g:   0, b: 255, a: 255 }
                ],
                currentIndex: 0,

                getColorCount: function () {

                    return palette.entries.length;

                },

                getColor: function (index) {

                    if (!_.isFinite(index)) {
                        throw new TypeError("Expected number for palette index, got " + typeof (index));
                    }

                    return palette.entries[index];

                },

                eachColor: function (func) {

                    if (!_.isFunction(func)) {
                        throw new TypeError("Expected function for palette iterator, got " + typeof (func));
                    }

                    _.each(palette.entries, func);
                },

                isValidIndex: function (index) {

                    if (!_.isFinite(index)) {
                        throw new TypeError("Expected number for palette index, got " + typeof (index));
                    }

                    if (palette.entries.length === 0) {
                        return false;
                    }

                    return (0 <= index && index < palette.entries.length);
                },

                getSelectedIndex: function () {
                    return palette.currentIndex;
                },

                setSelectedIndex: function (index) {

                    if (!_.isFinite(index)) {
                        throw new TypeError("Expected number for palette index, got " + typeof (index));
                    }

                    palette.currentIndex = index;

                    that.fireEvent("colorselected", { index: index });

                },

                withSelectedColor: function (func) {

                    if (!_.isFunction(func)) {
                        throw new TypeError("Expected function, got " + typeof (func));
                    }

                    func(palette.entries[palette.currentIndex]);
                }

            };

        that.getColorCount = palette.getColorCount;
        that.getColor = palette.getColor;
        that.eachColor = palette.eachColor;
        that.isValidIndex = palette.isValidIndex;
        that.getSelectedIndex = palette.getSelectedIndex;
        that.setSelectedIndex = palette.setSelectedIndex;
        that.withSelectedColor = palette.withSelectedColor;

    });

}(Warry));