(function (main) {
    "use strict";

    if (typeof (_) !== "function") {
        throw new Error("Underscore.js not found");
    }

    main.createService("tools", function () {

        var that = this,
            cursor = main.getService("cursor"),
            toolbox = {

                Tool: function (name) {

                    var toolobj = this;

                    toolobj.getName = function () {
                        return name || "Unnamed tool";
                    };

                    toolobj.isActive = function () {
                        return false;
                    };

                    toolobj.isPreviewValid = function () {
                        return true;
                    };

                    toolobj.reset = function () {

                    };

                    toolobj.abort = function () {

                    };

                    toolobj.commit = function () {
                        throw new Error("commit must be overridden in tool");
                    };

                    toolobj.down = function () {

                    };

                    toolobj.up = function () {

                    };

                    toolobj.move = function (x, y) {

                    };

                    toolobj.paintPreview = function (base, dest) {

                    };

                },

                SimpleTool: function (name) {

                    var toolobj = this,
                        active = false,
                        valid = true;

                    toolobj._setActive = function (value) {
                        if (value !== active) {
                            active = value;
                            toolobj.fireEvent("activechanged", { active: active });
                        }
                    };

                    toolobj._setValid = function (value) {
                        if (value !== valid) {
                            valid = value;
                            toolobj.fireEvent("validchanged", { valid: valid });
                        }
                    };

                    toolobj.getName = function () {
                        return name || "Unnamed simple tool";
                    };

                    toolobj.isActive = function () {
                        return active;
                    };

                    toolobj.isPreviewValid = function () {
                        return valid;
                    };

                    toolobj.abort = function () {
                        toolobj.reset();
                        toolobj._setActive(false);
                        toolobj._setValid(false);
                    };

                    toolobj.down = function () {

                        toolobj.reset();
                        toolobj._setActive(true);
                        toolobj._setValid(false);

                    };

                    toolobj.up = function () {
                        toolobj.commit();
                        toolobj.reset();

                        toolobj._setActive(false);
                        toolobj._setValid(false);
                    };

                    toolobj.move = function (x, y) {

                        toolobj._setValid(false);

                    };

                },

                current: null,
                available: {},

                currentToggled: function (e) {
                    that.fireEvent("activechanged", e);
                },

                currentInvalidated: function (e) {
                    that.fireEvent("validchanged", e);
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
                            toolbox.current.removeEventListener("validchanged", toolbox.currentInvalidated);
                        }

                        toolbox.current = tool;
                        toolbox.current.addEventListener("activechanged", toolbox.currentToggled);
                        toolbox.current.addEventListener("validchanged", toolbox.currentInvalidated);

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
        that.getTools = toolbox.getTools;
        that.getCurrent = toolbox.getCurrent;
        that.setCurrent = toolbox.setCurrent;

    });

}(Warry));