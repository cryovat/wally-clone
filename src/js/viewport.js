(function (main, _) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Viewport module loaded before main Warry module");
    }

    var viewport = {

        active: [],
        cursor: main.getService("cursor"),

        onSignal: function (type, data) {
            if (type.substring(0, 6) === "cursor") {
                _.each(viewport.active, function (v) {
                    v.invalidate();
                });
            }
        },

        addViewPort: function (id) {

            var pixelSize = 1, cursor = viewport.cursor, canvas, ctx, invalidate, getZoom, setZoom, getPixelSize, obj;

            canvas = document.getElementById(id);
            ctx = canvas.getContext("2d");

            if (!_.isElement(canvas)) {
                throw new Error("Canvas with id '" + id + "'not found");
            }

            invalidate = function () {
                var pos = cursor.getPosition();

                ctx.fillStyle = "rgb(0,100,0)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = "rgb(255,255,255)";
                ctx.fillText("X: " + pos.x + ", Y: " + pos.y, 10, 10);

                ctx.fillStyle = cursor.isDown() ? "rgb(255, 255, 51)" : "rgb(150, 150, 150)";
                ctx.fillRect(pos.x * pixelSize, pos.y * pixelSize, pixelSize, pixelSize);
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

                console.log(["size: " + pixelSize, "zoom: " + getZoom(), x, y]);
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
                getZoom: getZoom,
                setZoom: setZoom,
                getPixelSize: getPixelSize
            };

            viewport.active.push(obj);

            obj.invalidate();
            return obj;
        }
    };

    main.addService("viewport", {
        addViewPort: viewport.addViewPort,
        onSignal: viewport.onSignal
    });

}(this.Warry, this._));
