(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Viewport widget loaded before main Warry module");
    }

    main.addWidgetType("viewport", function (element) {

        var that = this,
            tile = main.getService("tile"),
            cursor = main.getService("cursor"),
            tools = main.getService("tools"),
            pixelSize = tile.getZoom(),
            repeat = tile.isRepeat(),
            times = repeat ? 3 : 1,
            canvas = element,
            ctx,
            resetBuffers,
            tileWidth,
            tileHeight,
            bufImg,
            bufTool,
            calcX,
            calcY,
            invPending = false,
            invalidate;

        ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;

        calcX = function (x) {
            return Math.min((times * tileWidth - 1) * pixelSize, x * pixelSize);
        };

        calcY = function (y) {
            return Math.min((times * tileHeight - 1) * pixelSize, y * pixelSize);
        };

        invalidate = function () {

            if (!invPending) {

                invPending = true;

                _.defer(function () {

                    var pos = cursor.getPosition(), tx, ty, tool = tools.getCurrent();

                    ctx.fillStyle = "rgb(0,100,0)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    for (tx = 0; tx < times; tx += 1) {
                        for (ty = 0; ty < times; ty += 1) {
                            ctx.putImageData(tool && tool.isActive() ? bufTool : bufImg, tx * tileWidth, ty * tileHeight);
                        }
                    }

                    ctx.drawImage(ctx.canvas, 0, 0, canvas.width * pixelSize, canvas.height * pixelSize);

                    ctx.fillStyle = cursor.isDown() ? "rgb(255, 255, 51)" : "rgb(150, 150, 150)";
                    ctx.fillRect(calcX(pos.x), calcY(pos.y), pixelSize, pixelSize);

                    if (repeat && pixelSize > 2) {
                        ctx.strokeStyle = "rgba(255, 255, 255, 90)";
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(0, tileHeight * pixelSize);
                        ctx.lineTo(tileWidth * 3 * pixelSize,  tileHeight * pixelSize);
                        ctx.moveTo(0, tileHeight * 2 * pixelSize);
                        ctx.lineTo(tileWidth * 3 * pixelSize,  tileHeight * 2 * pixelSize);
                        ctx.moveTo(tileWidth * pixelSize, 0);
                        ctx.lineTo(tileWidth * pixelSize,  tileHeight * 3 * pixelSize);
                        ctx.moveTo(tileHeight * 2 * pixelSize, 0);
                        ctx.lineTo(tileWidth * 2 * pixelSize,  tileHeight * 3 * pixelSize);
                        ctx.stroke();
                    }

                    invPending = false;

                });
            }

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

        tile.addEventListener("repeatchanged", function (e) {
            if (repeat !== e.repeat) {
                repeat = e.repeat;
                times = repeat ? 3 : 1;
                invalidate();
            }
        });

        tile.addEventListener("zoomchanged", function (e) {
            pixelSize = e.zoom;
            invalidate();
        });

        tile.addEventListener("imagechanged", function (e) {
            resetBuffers(e.info);
        });

        tools.addEventListener("validchanged", function (e) {

            var tool = tools.getCurrent();

            if (!tool.isPreviewValid()) {
                bufTool.data.set(bufImg.data, 0);

                tool.paintPreview(bufImg,  bufTool);
            }

            invalidate();

        });

        cursor.addEventListener("cursormove", function (e) {
            invalidate();
        });

        cursor.addEventListener("cursorup", function (e) {
            invalidate();
        });

        cursor.addEventListener("cursordown", function (e) {
            invalidate();
        });

        cursor.addEventListener("cursorcancel", function (e) {
            invalidate();
        });

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

        resetBuffers(tile.getTileInfo());

    });

}(this.Warry));