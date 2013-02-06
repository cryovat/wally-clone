(function (main, _) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Viewport module loaded before main Warry module");
    }

    var viewport = {

        active: [],
        tile: main.getService("tile"),
        cursor: main.getService("cursor"),

        onSignal: function (type, data) {

            if (type === "tile.loaded") {
                _.each(viewport.active, function (v) {

                    v.resetBuffers(data);
                });
            } else if (type.substring(0, 6) === "cursor") {
                _.each(viewport.active, function (v) {
                    v.invalidate();
                });
            }
        },

        addViewPort: function (id) {

            var pixelSize = 1, cursor = viewport.cursor, tile = viewport.tile,
                canvas, ctx, resetBuffers, tileWidth, tileHeight, bufImg, bufTool, invalidate,
                getZoom, setZoom, getPixelSize, obj;

            canvas = document.getElementById(id);
            ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;

            if (!_.isElement(canvas)) {
                throw new Error("Canvas with id '" + id + "'not found");
            }

            invalidate = function () {
                var pos = cursor.getPosition(), tx, ty;

                ctx.fillStyle = "rgb(0,100,0)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                for (tx = 0; tx < 3; tx += 1) {
                    for (ty = 0; ty < 3; ty += 1) {
                        ctx.putImageData(bufImg, tx * tileWidth, ty * tileHeight);
                    }
                }

                ctx.drawImage(ctx.canvas, 0, 0, canvas.width * pixelSize, canvas.height * pixelSize);

                ctx.fillStyle = "rgb(255,255,255)";
                ctx.fillText("X: " + pos.x + ", Y: " + pos.y, 10, 10);

                ctx.fillStyle = cursor.isDown() ? "rgb(255, 255, 51)" : "rgb(150, 150, 150)";
                ctx.fillRect(pos.x * pixelSize, pos.y * pixelSize, pixelSize, pixelSize);
            };

            resetBuffers = function (data) {

                var i = 0;

                tileWidth = Math.max(data.width, 1);
                tileHeight = Math.max(data.height, 1);

                ctx.fillStyle = "rgb(255,255,255)";
                tile.drawImage(ctx, 0, 0, tileWidth, tileHeight);

                bufImg = ctx.getImageData(0, 0, tileWidth, tileHeight);
                bufTool = ctx.getImageData(0, 0, tileWidth, tileHeight);

                for (i = 0; i < (tileWidth * tileHeight); i += 1) {
                    bufTool.data[i * 4] = 0;
                }

                invalidate();

            };

            getZoom = function () {
                return Math.sqrt(pixelSize);
            };

            setZoom = function (val) {
                pixelSize = Math.pow(2, Math.max(0, Math.min(15, val - 1)));
            };

            getPixelSize = function () {
                return pixelSize;
            };

            canvas.addEventListener("mousemove", function (e) {
                var rect = canvas.getBoundingClientRect(),
                    x = Math.floor((e.clientX - rect.left) / pixelSize),
                    y = Math.floor((e.clientY - rect.top) / pixelSize);

                cursor.move(x, y);
            });

            canvas.addEventListener("mousedown", function () {
                cursor.down();
            });

            canvas.addEventListener("mouseup", function () {
                cursor.up();
            });

            canvas.addEventListener("mouseout", function () {
                cursor.cancel();
            });

            canvas.addEventListener("blur", function () {
                cursor.cancel();
            });

            obj = {
                invalidate: invalidate,
                resetBuffers: resetBuffers,
                getZoom: getZoom,
                setZoom: setZoom,
                getPixelSize: getPixelSize
            };

            viewport.active.push(obj);
            obj.resetBuffers(tile.getTileInfo());
            return obj;
        }
    };

    main.addService("viewport", {
        addViewPort: viewport.addViewPort,
        onSignal: viewport.onSignal
    });

}(this.Warry, this._));
