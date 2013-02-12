(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Action module loaded before main Warry module");
    }

    var hash = 0;
    window.foo = [];

    main.createService("action", function () {

        var that = this,
            BaseAction,
            DragAction,
            LineAction,
            RectAction,
            CircleAction,
            CompositeAction,
            ploti = function (data, i, color) {
                data[i * 4] = color.r;
                data[i * 4 + 1] = color.g;
                data[i * 4 + 2] = color.b;
                data[i * 4 + 3] = color.a;
            },
            plot = function (data, x, width, y, color) {
                ploti(data, y * width + x, color);
            };

        BaseAction = function () {

            this.applyAction = function (source, dest) {
                throw new Error("Action not implemented!");
            };

        };

        DragAction = function () {

            this.initDefaults = function () {
                this._color = { r: 255, g: 255, b: 255, a: 255  };
                this._start = { x: 0, y: 0 };
                this._current = { x: 0, y: 0 };
            };

            this.setColor = function (c) {
                this._color = c;
            };

            this.copyColor = function (c) {
                this._color = { r: c.r, g: c.g, b: c.b, a: c.a };
            };

            this.getColor = function () {
                return this._color;
            };

            this.setStart = function (x, y) {

                if (!_.isFinite(x)) {
                    throw new TypeError("Start X coordinate must be finite number, got " + typeof (x));
                }

                if (!_.isFinite(y)) {
                    throw new TypeError("Start Y coordinate must be finite number, got " + typeof (y));
                }

                this._start.x = x;
                this._start.y = y;

            };

            this.setCurrent = function (x, y) {

                if (!_.isFinite(x)) {
                    throw new TypeError("Current X coordinate must be finite number, got " + typeof (x));
                }

                if (!_.isFinite(y)) {
                    throw new TypeError("Current Y coordinate must be finite number, got " + typeof (y));
                }

                this._current.x = x;
                this._current.y = y;

            };

            this.setStartToCurrent = function () {

                this._start.x = this._current.x;
                this._start.y = this._current.y;

            };
        };

        LineAction = function () {

            this.initDefaults();

            var that = this;

            this.applyAction = function (source, dest) {

                var x0, y0, x1, y1, dx, dy, sx, sy, err, e2;

                x0 = that._start.x;
                y0 = that._start.y;
                x1 = that._current.x;
                y1 = that._current.y;

                dx = Math.abs(x1 - x0);
                dy = Math.abs(y1 - y0);

                sx = x0 < x1 ? 1 : -1;
                sy = y0 < y1 ? 1 : -1;

                err = dx - dy;

                while (true) {
                    plot(dest.data, x0 % dest.width, dest.width, y0 % dest.height, that._color);

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

            };

            this.toString = function () {
                return "Line from " + this._start.x + "," + this._start.y + " to " + this._current.x + "," + this._current.y;
            };

        };

        RectAction = function () {

            this.initDefaults();

            var that = this;

            this.applyAction = function (source, dest) {

                var x0, y0, x1, y1, sx, sy, x, y;

                x0 = that._start.x;
                y0 = that._start.y;
                x1 = that._current.x;
                y1 = that._current.y;

                sx = x0 < x1 ? 1 : -1;
                sy = y0 < y1 ? 1 : -1;

                x = x0;

                do {
                    y = y0;

                    do {
                        plot(dest.data, x % dest.width, dest.width, y % dest.height, that._color);
                        y += sy;

                    } while (y - sy !== y1);

                    x += sx;
                } while (x - sx !== x1);

            };

        };

        CircleAction = function () {

            this.initDefaults();

            this.calcRadius = function () {
                return Math.floor(Math.sqrt(Math.pow(this._start.x - this._current.x, 2) + Math.pow(this._start.y - this._current.y, 2)));
            };

            var that = this;

            this.applyAction = function (source, dest) {

                var x0 = that._start.x,
                    y0 = that._start.y,
                    radius = that.calcRadius(),
                    x = radius,
                    y = 0,
                    xChange = 1 - (radius << 1),
                    yChange = 0,
                    err = 0,
                    draw = function (px, py) {
                        plot(dest.data, px % dest.width, dest.width, py % dest.width, that._color);
                    };

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

            };

        };

        CompositeAction = function () {

            var that = this;

            this.actions = [];

            this.add = function (action) {
                this.actions.push(action);
            };

            this.applyAction = function (source, dest) {

                _.each(that.actions, function (a) {
                    a.applyAction(source, dest);
                });
            };

        };

        LineAction.prototype = new DragAction();
        RectAction.prototype = LineAction.prototype;
        CircleAction.prototype = LineAction.prototype;
        CompositeAction.prototype = new BaseAction();

        this.createLine = function () {
            return new LineAction();
        };

        this.createRect = function () {
            return new RectAction();
        };

        this.createCircle = function () {
            return new CircleAction();
        };

        this.createComposite = function () {
            return new CompositeAction();
        };

    });

}(this.Warry));