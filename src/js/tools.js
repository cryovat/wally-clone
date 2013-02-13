(function (main) {
    "use strict";

    if (typeof (_) !== "function") {
        throw new Error("Underscore.js not found");
    }

    main.createService("tools", function () {

        var that = this,
            cursor = main.getService("cursor"),
            history = main.getService("history"),
            toolbox = {

                Tool: function (name) {

                    this.init = function () {
                        this._active = false;
                    };

                    this._setActive = function (value) {

                        if (value !== this._active) {
                            this._active = value;
                            this.fireEvent("activechanged", { active: this._active });
                        }
                    };

                    this.paintPreviews = function () {
                        this.fireEvent("paintpreview", { painter: this._painter });
                    };

                    this.setPreviewPainter = function (p) {
                        this._painter = p;
                    };

                    this.getName = function () {
                        return name || "Unnamed tool";
                    };

                    this.isActive = function () {
                        return this._active;
                    };

                    this.reset = function () {

                    };

                    this.abort = function () {

                    };

                    this.commit = function () {
                        throw new Error("commit must be overridden in tool");
                    };

                    this.down = function () {

                    };

                    this.up = function () {

                    };

                    this.move = function (x, y) {

                    };

                    this.getPreviewPainter = function () {
                        throw new Error("getPreviewPainter function must be overridden");
                    };

                },

                SimpleTool: function (name) {

                    if (this.init) {
                        this.init();
                    }

                    this.getName = function () {
                        return name || "Unnamed simple tool";
                    };

                    this.abort = function () {
                        this.reset();
                        this._setActive(false);
                        this.paintPreviews();
                    };

                    this.onDown = function () {

                    };

                    this.down = function () {

                        this.reset();
                        this._setActive(true);

                        this.onDown();

                        this.paintPreviews();
                    };

                    this.onUp = function () {

                    };

                    this.up = function () {

                        this._setActive(false);
                        this.commit();
                        this.reset();

                        this.onUp();

                        this.paintPreviews();
                    };

                },

                current: null,
                available: {},

                currentToggled: function (e) {
                    that.fireEvent("activechanged", e);
                },

                paintPreview: function (e) {
                    that.fireEvent("paintpreview", e);
                },

                addTool: function (name, tool) {

                    if (!_.isString(name)) {
                        throw new TypeError("Tool name must be string, got " + typeof (name));
                    }

                    if (!_.isObject(tool)) {
                        throw new TypeError("Tool must be object, got " + typeof (tool));
                    }

                    toolbox.available[name] = tool;

                    that.fireEvent("tooladded", { name: name });

                    if (!toolbox.current) {
                        toolbox.setCurrent(name);
                    }
                },

                createToolInternal: function (name, constructor, maker) {

                    if (!_.isString(name)) {
                        throw new TypeError("Tool name must be string, got " + typeof (name));
                    }

                    if (!_.isFunction(constructor)) {
                        throw new TypeError("Constructor must be a function, got " + typeof (constructor));
                    }

                    var tool = maker();

                    constructor.call(tool);

                    toolbox.addTool(name, tool);

                },

                createTool: function (name, constructor) {
                    toolbox.createToolInternal(name, constructor, function () { return new toolbox.Tool(); });
                },

                createSimpleTool: function (name, constructor) {
                    toolbox.createToolInternal(name, constructor, function () { return new toolbox.SimpleTool(); });
                },

                createDragActionTool: function (name, factory, colorSource) {

                    toolbox.createSimpleTool(name, function () {

                        var dragAct,
                            lastX = 0,
                            lastY = 0;

                        this.onDown = function () {
                            dragAct.setStart(lastX, lastY);
                        };

                        this.reset = function () {
                            dragAct = factory();
                            dragAct.setColor(colorSource());
                            dragAct.setStart(lastX, lastY);
                            dragAct.setCurrent(lastX, lastY);
                            this.setPreviewPainter(dragAct.applyAction);
                        };

                        this.move = function (x, y) {

                            if (this.isActive()) {
                                this.paintPreviews();
                            }

                            dragAct.setCurrent(x, y);
                            lastX = x;
                            lastY = y;
                        };

                        this.commit = function () {
                            history.addAction(dragAct);
                        };

                    });

                },

                getTools: function () {
                    return _.keys(toolbox.available);
                },

                setCurrent: function (name) {

                    if (!_.isString(name)) {
                        throw new TypeError("Tool name must be string, got " + typeof (name));
                    }

                    var tool = toolbox.available[name];

                    if (tool) {
                        if (toolbox.current) {
                            toolbox.current.removeEventListener("activechanged", toolbox.currentToggled);
                            toolbox.current.removeEventListener("paintpreview", toolbox.paintPreview);
                        }

                        toolbox.current = tool;
                        toolbox.current.addEventListener("activechanged", toolbox.currentToggled);
                        toolbox.current.addEventListener("paintpreview", toolbox.paintPreview);
                        toolbox.current.reset();

                        that.fireEvent("toolchanged", { name: name });
                    }
                },

                getCurrent: function () {
                    return toolbox.current;
                }


            };

        cursor.addEventListener("cursordown", function () {
            if (toolbox.current) {
                toolbox.current.down();
            }
        });

        cursor.addEventListener("cursorup", function () {
            if (toolbox.current) {
                toolbox.current.up();
            }
        });

        cursor.addEventListener("cursormove", function (e) {
            if (toolbox.current) {
                toolbox.current.move(e.x, e.y);
            }
        });

        cursor.addEventListener("cursorcancel", function (e) {
            if (toolbox.current) {
                toolbox.current.abort();
            }
        });

        toolbox.Tool.prototype = main.createModel();
        toolbox.SimpleTool.prototype = new toolbox.Tool();

        that.addTool = toolbox.addTool;
        that.createTool = toolbox.createTool;
        that.createSimpleTool = toolbox.createSimpleTool;
        that.createDragActionTool = toolbox.createDragActionTool;
        that.getTools = toolbox.getTools;
        that.getCurrent = toolbox.getCurrent;
        that.setCurrent = toolbox.setCurrent;

    });

}(Warry));