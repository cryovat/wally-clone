(function (main, _) {
    "use strict";

    if (typeof (_) !== "function") {
        throw new Error("Underscore.js not found");
    }

    var tile = {
        baseImage: new Image(),

        drawImage: function (ctx, x, y, width, height) {
            if (tile.baseImage.complete) {
                ctx.drawImage(tile.baseImage, x, y, width, height);
            }
        },

        drawImageClipped: function (ctx, sx, sy, swidth, sheight, x, y, width, height) {
            ctx.drawImage(tile.baseImage, sx, sy, swidth, sheight, x, y, width, height);
        },

        getWidth: function () {
            return tile.baseImage.width;
        },

        getHeight: function () {
            return tile.baseImage.height;
        },

        loadFromUrl: function (url) {

            if (!_.isString(url)) {
                throw new TypeError("Expected tile url to be string but got " + typeof (url));
            }

            tile.baseImage.src = url;

        }
    };

    tile.baseImage.addEventListener("load", function () {
        main.broadcast("tile.loaded", {});
    });

    main.addService("tile", {

        drawImage: tile.drawImage,
        drawImageClipped: tile.drawImageClipped,

        getWidth: tile.getWidth,
        getHeight: tile.getHeight,

        loadFromUrl: tile.loadFromUrl

    });

}(this.Warry, this._));