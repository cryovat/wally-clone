(function (global) {
    "use strict";

    if (typeof (_) !== "function") {
        throw new Error("Underscore.js not found");
    }

    var core = {

        services: {},
        widgetTypes: {},
        Model: function () {

            var events = {};

            this.addEventListener = function (type, func) {

                if (!_.isString(type)) {
                    throw new TypeError("Event type must be string, got " + typeof (type));
                }

                if (!_.isFunction(func)) {
                    throw new TypeError("Event handler must be function, got " + typeof (func));
                }

                events[type] = _.union((events[type] || []), [func]);
            };

            this.removeEventListener = function (type, func) {

                if (!_.isString(type)) {
                    throw new TypeError("Event type must be string, got " + typeof (type));
                }

                if (!_.isFunction(func)) {
                    throw new TypeError("Event handler must be function, got " + typeof (func));
                }

                if (events[type]) {
                    events[type] = _.without(events[type], func);
                }

            };

            this.fireEvent = function (type, event) {

                if (!_.isString(type)) {
                    throw new TypeError("Event type must be string, got " + typeof (type));
                }

                var handlers = events[type];

                if (handlers) {
                    _.each(handlers, function (handler) {
                        handler(event);
                    });
                }

            };

            this.toString = function () {
                return "Model";
            };

        },

        addService: function (id, m) {

            if (!_.isString(id)) {
                throw new TypeError("Service ID must be string, got " + typeof (id));
            }

            if (!_.isObject(m)) {
                throw new TypeError("Service must be an object, got " + typeof (m));
            }

            core.services[id] = m;
        },

        createService: function (id, constructor) {

            if (!_.isString(id)) {
                throw new TypeError("Service ID must be string, got " + typeof (id));
            }

            if (!_.isObject(constructor)) {
                throw new TypeError("Constructor must be a function, got " + typeof (constructor));
            }

            var service = new core.Model();
            constructor.call(service)

            core.addService(id, service);
        },

        getService: function (id) {

            if (!_.isString(id)) {
                throw new TypeError("Service ID must be string, got " + typeof (id));
            }

            var service = core.services[id];

            if (!_.isObject(service)) {
                throw new Error("Unregisted service: '" + id + "'");
            }

            return service;
        },

        getServices: function () {
            return _.map(core.services, function (s) { return s; });
        },

        broadcast: function (signalType, data) {

            if (!_.isString(signalType)) {
                throw new TypeError("Signal type must be a string, got " + typeof (signalType));
            }

            if (!_.isObject(data)) {
                throw new TypeError("Signal data must be a string, got " + typeof (data));
            }

            _.each(core.services, function (svc) {
                var handler = svc.onSignal;

                if (_.isFunction(handler)) {
                    handler(signalType, data);
                }
            });

        },

        addWidgetType: function (type, factory) {

            if (!_.isString(type)) {
                throw new TypeError("Widget type must be a string, got " + typeof (type));
            }

            if (!_.isFunction(factory)) {
                throw new TypeError("Widget factory must be a function, got " + typeof (factory));
            }

            core.widgetTypes[type] = factory;
        },

        createWidget: function (type, elementId) {

            if (!_.isString(type)) {
                throw new TypeError("Widget type must be a string, got " + typeof (type));
            }

            if (!_.isString(elementId)) {
                throw new TypeError("Element Id must be a string, got " + typeof (elementId));
            }

            var factory, element;

            factory = core.widgetTypes[type];

            if (!_.isFunction(factory)) {
                throw new TypeError("No factory was found for widget type '" + type + "'");
            }

            element = document.getElementById(elementId);

            if (!_.isElement(element)) {
                throw new Error("Element with id '" + elementId + "' was not found in page.");
            }

            return factory(element);
        }

    };

    global.Warry = {

        createService: core.createService,
        addService: core.addService,
        getService: core.getService,
        getServices: core.getServices,
        broadcast: core.broadcast,
        addWidgetType: core.addWidgetType,
        createWidget: core.createWidget
    };

}(this));