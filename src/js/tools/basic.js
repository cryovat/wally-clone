(function (global) {
    "use strict";

    if (typeof (global.window._) !== "function") {
        throw new Error("Underscore.js not found");
    }

    if (!global.window._.isObject(global.window.Warry)) {
        throw new Error("Basic editing tools loaded before main Warry module");
    }

    var w = global.window,
        _ = w._,
        main = w.Warry,
        tools = main.getService("tools"),
        palette = main.getService("palette"),
        tile = main.getService("tile"),
        action = main.getService("action"),
        history = main.getService("history"),
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

        var pen = this,
            compAct,
            start = {x: 0, y: 0},
            current = {x: 0, y: 0};

        pen.reset = function () {

            compAct = action.createComposite("Pen");
            start.x = current.x;
            start.y = current.y;
            pen.setPreviewPainter(compAct.applyAction);
        };

        pen.move = function (x, y) {

            current.x = x;
            current.y = y;

            if (pen.isActive()) {

                var line;

                if (current.x !== start.x && current.y !== start.y) {
                    line = action.createLine();
                    line.setStart(start.x, start.y);
                    line.setCurrent(current.x, current.y);
                    compAct.add(line);

                    start.x = current.x;
                    start.y = current.y;
                }

                pen.paintPreviews();
            }

        };

        pen.commit = function () {
            history.addAction(compAct);
        };

    });

    tools.createDragActionTool("line", action.createLine, palette.getSelectedColor);
    tools.createDragActionTool("rectangle", action.createRect, palette.getSelectedColor);
    tools.createDragActionTool("circle", action.createCircle, palette.getSelectedColor);

}(this));