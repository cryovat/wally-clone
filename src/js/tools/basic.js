(function (main) {
    "use strict";

    var tools = main.getService("tools"),
        palette = main.getService("palette"),
        tile = main.getService("tile"),
        ploti = function (data, i, color) {
            data[i * 4] = color.r;
            data[i * 4 + 1] = color.g;
            data[i * 4 + 2] = color.b;
            data[i * 4 + 3] = color.a;
        },
        plot = function (data, x, width, y, color) {
            ploti(data, y * width + x, color);
        };

    tools.createSimpleTool("pen", function () {

        var pen = this, down = [];

        pen.reset = function () {

            var i, info = tile.getTileInfo();

            for (i = 0; i < (info.width * info.height); i += 1) {
                down[i] = false;
            }
        };

        pen.move = function (x, y) {

            if (pen.isActive()) {

                var info = tile.getTileInfo();
                x = x % info.width;
                y = y % info.height;

                down[y * info.width + x] = true;
                pen._setValid(false);
            }
        };

        pen.paintPreview = function (base, dest) {
            var i, info = tile.getTileInfo(), count = 0;

            palette.withSelectedColor(function (c) {
                for (i = 0; i < (info.width * info.height); i += 1) {
                    if (down[i]) {
                        ploti(dest.data, i, c);
                    }
                }
            });

            pen._setValid(true);
        };

        pen.commit = function () {

        };

    });

    tools.createSimpleTool("line", function () {

        var line = this,
            baseDown = line.down,
            start = {x: 0, y: 0},
            current = {x: 0, y: 0};

        line.down = function () {
            start.x = current.x;
            start.y = current.y;
            baseDown();
        };

        line.move = function (x, y) {

            var info = tile.getTileInfo();

            current.x = x;
            current.y = y;

            line._setValid(false);
        };

        line.paintPreview = function (base, dest) {

            var info = tile.getTileInfo();

            palette.withSelectedColor(function (c) {

                var x0, y0, x1, y1, dx, dy, sx, sy, err, e2;

                x0 = start.x;
                y0 = start.y;
                x1 = current.x;
                y1 = current.y;

                dx = Math.abs(x1 - x0);
                dy = Math.abs(y1 - y0);

                sx = x0 < x1 ? 1 : -1;
                sy = y0 < y1 ? 1 : -1;

                err = dx - dy;

                while (true) {
                    plot(dest.data, x0 % info.width, info.width, y0 % info.height, c);

                    if (x0 === x1 && y0 === y1) {
                        break;
                    }

                    e2 = 2 * err;

                    if (e2 > -dy) {
                        err -= dy;
                        x0 += sx;
                    }

                    if (e2 < dx) {
                        err += dx;
                        y0 = y0 + sy;
                    }

                }

            });

            line._setValid(true);

        };

        line.commit = function () {

        };

    });

    tools.createSimpleTool("rectangle", function () {

        var rectangle = this,
            baseDown = rectangle.down,
            start = {x: 0, y: 0},
            current = {x: 0, y: 0};

        rectangle.down = function () {
            start.x = current.x;
            start.y = current.y;
            baseDown();
        };

        rectangle.move = function (x, y) {

            current.x = x;
            current.y = y;

            rectangle._setValid(false);
        };

        rectangle.paintPreview = function (base, dest) {

            var info = tile.getTileInfo();

            palette.withSelectedColor(function (c) {

                var x0, y0, x1, y1, sx, sy, x, y;

                x0 = start.x;
                y0 = start.y;
                x1 = current.x;
                y1 = current.y;

                sx = x0 < x1 ? 1 : -1;
                sy = y0 < y1 ? 1 : -1;

                x = x0;

                do {
                    y = y0;

                    do {
                        plot(dest.data, x % info.width, info.width, y % info.height, c);
                        y += sy;

                    } while (y - sy !== y1);

                    x += sx;
                } while (x - sx !== x1);

            });

            rectangle._setValid(true);

        };


        rectangle.commit = function () {

        };

    });

    tools.createSimpleTool("circle", function () {

        var circle = this,
            baseDown = circle.down,
            start = {x: 0, y: 0},
            current = { x: 0, y: 0},
            radius = 0;

        circle.calcRadius = function () {
            return Math.floor(Math.sqrt(Math.pow(start.x - current.x, 2) + Math.pow(start.y - current.y, 2)));
        };

        circle.down = function () {
            start.x = current.x;
            start.y = current.y;
            baseDown();
        };

        circle.move = function (x, y) {

            current.x = x;
            current.y = y;

            circle._setValid(false);
        };

        circle.paintPreview = function (base, dest) {

            var info = tile.getTileInfo(),
                x0 = start.x,
                y0 = start.y,
                radius = circle.calcRadius(),
                x = radius,
                y = 0,
                xChange = 1 - (radius << 1),
                yChange = 0,
                err = 0;

            palette.withSelectedColor(function (c) {

                var draw = function (px, py) {
                    plot(dest.data, px % info.width, info.width, py % info.width, c);
                }

                while (x >= y) {

                    draw(x + x0, y + y0);
                    draw(y + x0, x + y0);

                    draw(-x + x0, y + y0);
                    draw(-y + x0, x + y0);

                    draw(-x + x0, -y + y0);
                    draw(-y + x0, -x + y0);

                    draw(x + x0, -y + y0);
                    draw(y + x0, -x + y0);

                    y += 1;
                    err += yChange;
                    yChange += 2;

                    if (((err << 1) + xChange) > 0) {
                        x -= 1;
                        err += xChange;
                        xChange += 2;
                    }

                }

            });

            circle._setValid(true);

        };

        circle.commit = function () {

        };

    });

}(Warry));