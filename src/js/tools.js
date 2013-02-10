(function (main) {
    "use strict";

    if (typeof (_) !== "function") {
        throw new Error("Underscore.js not found");
    }

    main.createService("toolbox", function () {

        var that = this,
            toolbox = {

                current: null,
                available: {},

                addTool: function (name, tool) {

                    if (!_.isString(name)) {
                        throw new TypeError("Tool name must be string, got " + typeof (name));
                    }

                    if (!_.isFunction(tool)) {
                        throw new TypeError("Tool must be object, got " + typeof (tool));
                    }

                    toolbox.available[name] = tool;

                    that.fireEvent("tooladded", { name: name });

                },

                getTools: function () {
                    return _.keys(toolbox.available);
                }


            };

        that.drawImage = tile.drawImage;
        that.drawImageClipped = tile.drawImageClipped;
        that.getTileInfo = tile.getTileInfo;
        that.loadFromUrl = tile.loadFromUrl;

    });

}(Warry));