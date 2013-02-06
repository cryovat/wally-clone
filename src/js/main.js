(function (_) {
    "use strict";

    if (typeof (_) !== "function") {
        throw new Error("Underscore.js not found");
    }

    var core = {

        services: {},

        addService: function (id, m) {

            if (!_.isString(id)) {
                throw new TypeError("Service ID must be string");
            }

            if (!_.isObject(m)) {
                throw new TypeError("Service must be an object");
            }

            core.services[id] = m;
        },

        getService: function (id) {

            if (!_.isString(id)) {
                throw new TypeError("Service ID must be string");
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
                throw new TypeError("Signal type must be a string");
            }

            if (!_.isObject(data)) {
                throw new TypeError("Signal data must be a string");
            }

            _.each(core.services, function (svc) {
                var handler = svc.onSignal;

                if (_.isFunction(handler)) {
                    handler(signalType, data);
                }
            });

        }

    };

    core.canvas = document.getElementById("mainCanvas");

    if (core.canvas === null) {
        throw new Error("Canvas with id 'mainCanvas' not found!");
    }

    window.Warry = {

        addService: core.addService,
        getService: core.getService,
        getServices: core.getServices,
        broadcast: core.broadcast

    };

}(this._));