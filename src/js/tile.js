(function (main) {
    "use strict";

    if (typeof (_) !== "function") {
        throw new Error("Underscore.js not found");
    }

    main.createService("tile", function () {

        var that = this,
            tile = {

                baseImage: new Image(),
                zoom: 8,
                zoomLevels: [1, 2, 4, 8, 16, 32],

                drawImage: function (ctx, x, y, width, height) {
                    if (tile.baseImage.complete && tile.baseImage.width > 0 && tile.baseImage.height > 0) {
                        ctx.drawImage(tile.baseImage, x, y, width, height);
                    }
                },

                drawImageClipped: function (ctx, sx, sy, swidth, sheight, x, y, width, height) {
                    ctx.drawImage(tile.baseImage, sx, sy, swidth, sheight, x, y, width, height);
                },

                getZoom: function () {
                    return tile.zoom;
                },

                setZoom: function (zoom) {

                    if (!_.isFinite(zoom)) {
                        throw new TypeError("Expected zoom level to be finite number, got " + typeof (zoom));
                    }

                    if (zoom !== tile.zoom) {
                        tile.zoom = zoom;
                        that.fireEvent("zoomchanged", { zoom: zoom });
                    }
                },

                getZoomLevels: function () {
                    return tile.zoomLevels.slice(0);
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
                }
            };

        tile.baseImage.addEventListener("load", function (e) {
            that.fireEvent("imagechanged", { info: tile.getTileInfo() });
        });

        that.drawImage = tile.drawImage;
        that.drawImageClipped = tile.drawImageClipped;

        that.getZoom = tile.getZoom;
        that.setZoom = tile.setZoom;
        that.getZoomLevels = tile.getZoomLevels;

        that.getTileInfo = tile.getTileInfo;
        that.loadFromUrl = tile.loadFromUrl;

    });

}(Warry));