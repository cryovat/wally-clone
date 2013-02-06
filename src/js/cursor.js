(function (main, _) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Cursor module loaded before main Warry module");
    }

    var cursor = {

        data: {
            x: 0,
            y: 0,
            isDown: false
        },

        getPosition: function () {
            return { x: cursor.data.x, y: cursor.data.y };
        },

        move: function (x, y) {

            if (!_.isNumber(x)) {
                throw new TypeError("Expected number for 'x' value, but got " + typeof (x));
            }

            if (!_.isNumber(y)) {
                throw new TypeError("Expected number for 'y' value, but got " + typeof (y));
            }

            cursor.data.x = x;
            cursor.data.y = y;

            main.broadcast("cursor.move", {x: cursor.data.x, y: cursor.data.y });
        },

        isDown: function () {
            return cursor.data.isDown;
        },

        down: function () {
            if (!cursor.data.isDown) {
                cursor.data.isDown = true;
                main.broadcast("cursor.down", {});
            }
        },

        up: function () {
            if (cursor.data.isDown) {
                cursor.data.isDown = false;
                main.broadcast("cursor.up", {});
            }
        },

        cancel: function () {
            if (cursor.data.isDown) {
                cursor.data.isDown = false;
                main.broadcast("cursor.cancel", {});
            }
        }
    };

    main.addService("cursor", {
        getPosition: cursor.getPosition,
        isDown: cursor.isDown,
        move: cursor.move,
        down: cursor.down,
        up: cursor.up,
        cancel: cursor.cancel
    });

}(this.Warry, this._));