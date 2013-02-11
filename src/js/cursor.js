(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Cursor service loaded before main Warry module");
    }

    main.createService("cursor", function () {

        var that = this,
            cursor = {

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

                    that.fireEvent("cursormove", {x: cursor.data.x, y: cursor.data.y });
                },

                isDown: function () {
                    return cursor.data.isDown;
                },

                down: function () {
                    if (!cursor.data.isDown) {
                        cursor.data.isDown = true;
                        that.fireEvent("cursordown", {});
                    }
                },

                up: function () {
                    if (cursor.data.isDown) {
                        cursor.data.isDown = false;
                        that.fireEvent("cursorup", {});
                    }
                },

                cancel: function () {
                    if (cursor.data.isDown) {
                        cursor.data.isDown = false;
                        that.fireEvent("cursorcancel", {});
                    }
                }

            };

        that.getPosition = cursor.getPosition;
        that.move = cursor.move;
        that.isDown = cursor.isDown;
        that.down = cursor.down;
        that.up = cursor.up;
        that.cancel = cursor.cancel;

    });

}(Warry));