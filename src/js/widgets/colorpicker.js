(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Palette view module loaded before main Warry module");
    }

    var internal = {

        invert: function (component) {
            return (component + 128) % 256;
        }

    }

    main.addWidgetType("colorpicker", function (canvas) {

        var palette = main.getService("palette"),
            invalidate,
            cols = 8,
            rows = 256 / cols,
            ctx,
            current;

        ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;

        invalidate = function () {

            var ci, ri, remHeight, cw, ch, x, y;

            cw = Math.floor((canvas.width) / cols);
            ch = Math.floor((canvas.height - 48) / rows);

            remHeight = canvas.height - ch * rows;

            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = "rgb(255,255,255)";

            current = palette.getSelectedIndex();

            palette.eachColor(function (color, index) {
                x = cw * (index % cols);
                y = ch * Math.floor(index / cols);

                ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                ctx.fillRect(x, y, cw, ch);

                if (index === current) {
                    ctx.strokeStyle = "rgb(" + internal.invert(color.r) + "," + internal.invert(color.g) + "," + internal.invert(color.b) + ")";
                    ctx.strokeRect(x + 1, y + 1, cw - 3, ch - 3);
                }

            });

            palette.withSelectedColor(function (color) {

                x = 0;
                y = (rows * ch);

                var width = canvas.width,
                    height = canvas.height - y;

                ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                ctx.fillRect(x, y, width, height);

                ctx.strokeStyle = "rgb(" + internal.invert(color.r) + "," + internal.invert(color.g) + "," + internal.invert(color.b) + ")";
                ctx.strokeRect(x + 1, y + 1, width - 3, height - 3);

            });

        };

        palette.addEventListener("colorselected", function () {
            invalidate();
        });

        canvas.addEventListener("click", function (e) {
            var rect = canvas.getBoundingClientRect(),
                cw = Math.floor((canvas.width) / cols),
                ch = Math.floor((canvas.height - 48) / rows),
                x = Math.floor((e.clientX - rect.left) / cw),
                y = Math.floor((e.clientY - rect.top) / ch),
                index = x + (y * cols);

            if (palette.isValidIndex(index)) {
                palette.setSelectedIndex(index);
            }
        });

        invalidate();
    });

}(this.Warry));