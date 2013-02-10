(function (main) {
    "use strict";

    if (typeof (_) !== "function") {
        throw new Error("Underscore.js not found");
    }

    main.createService("tools", function () {

        var that = this,
            toolbox = {

                Tool: function (name) {

                    var toolobj = this;

                    toolobj.getName = function () {
                        return name;
                    };

                    toolobj.begin = function (x, y) {

                    };

                    toolobj.move = function (x, y) {

                    };

                    toolobj.abort = function () {

                    };

                    toolobj.commit = function () {

                    };
                },

                current: null,
                available: {},

                addTool: function (name, tool) {

                    if (!_.isString(name)) {
                        throw new TypeError("Tool name must be string, got " + typeof (name));
                    }

                    if (!_.isObject(tool)) {
                        throw new TypeError("Tool must be object, got " + typeof (tool));
                    }

                    toolbox.available[name] = tool;

                    that.fireEvent("tooladded", { name: name });

                },

                createTool: function (name, constructor) {

                    if (!_.isString(name)) {
                        throw new TypeError("Tool name must be string, got " + typeof (name));
                    }

                    if (!_.isFunction(constructor)) {
                        throw new TypeError("Constructor must be a function, got " + typeof (constructor));
                    }

                    var tool = new toolbox.Tool(name);

                    constructor.call(tool);

                    toolbox.addTool(name, tool);

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
                        toolbox.current = tool;
                        that.fireEvent("toolchanged", { name: name });
                    }
                },

                getCurrent: function (name) {
                    return toolbox.current;
                }


            };

        toolbox.Tool.prototype = main.createModel();

        that.addTool = toolbox.addTool;
        that.createTool = toolbox.createTool;
        that.getTools = toolbox.getTools;
        this.getCurrent = toolbox.getCurrent;
        that.setCurrent = toolbox.setCurrent;

    });

}(Warry));