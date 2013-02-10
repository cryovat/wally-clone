(function (main) {
    "use strict";

    if (typeof (_) !== "function") {
        throw new Error("Underscore.js not found");
    }

    main.createService("tile", function () {

        var that = this,
            tile = {

                baseImage: new Image(),

                drawImage: function (ctx, x, y, width, height) {
                    if (tile.baseImage.complete) {
                        ctx.drawImage(tile.baseImage, x, y, width, height);
                    }
                },

                drawImageClipped: function (ctx, sx, sy, swidth, sheight, x, y, width, height) {
                    ctx.drawImage(tile.baseImage, sx, sy, swidth, sheight, x, y, width, height);
                },

                getTileInfo: function () {
                    return {
                        width: tile.baseImage.width,
                        height: tile.baseImage.height
                    };
                },

                loadFromUrl: function (url) {

                    if (!_.isString(url)) {
                        throw new TypeError("Expected tile url to be string but got " + typeof (url));
                    }

                    tile.baseImage.src = url;

                    that.fireEvent("imagechanged", { info: tile.getTileInfo() });
                }
            };

        that.drawImage = tile.drawImage;
        that.drawImageClipped = tile.drawImageClipped;
        that.getTileInfo = tile.getTileInfo;
        that.loadFromUrl = tile.loadFromUrl;

    });

}(Warry));