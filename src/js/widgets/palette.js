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

    main.addWidgetType("palette", function (canvas) {

        var invalidate, cols = 8, rows = 256 / cols, ctx, cw, ch, r, g, b, x, y, w, h, invert;

        ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;

        invalidate = function () {

            var ci, ri, remHeight;

            cw = Math.floor((canvas.width) / cols);
            ch = Math.floor((canvas.height - 48) / rows);

            remHeight = canvas.height - ch * rows;

            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = "rgb(255,255,255)";

            for (ci = 0; ci < cols; ci += 1) {
                for (ri = 0; ri < rows; ri += 1) {
                    r = Math.floor(Math.random() * 255);
                    g = Math.floor(Math.random() * 255);
                    b = Math.floor(Math.random() * 255);


                    x = (ci * cw);
                    y = (ri * ch);
                    w = cw;
                    h = ch;

                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.lineCap = "square";
                    ctx.lineWidth = 1;
                    ctx.fillRect(x, y, w, h);

                    if (ci === 2 && ri === 2) {
                        r = internal.invert(r);
                        g = internal.invert(g);
                        b = internal.invert(b);

                        ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
                        ctx.strokeRect(x, y, w, h);

                    }

                }
            }


        };

        invalidate();
    });

}(this.Warry));