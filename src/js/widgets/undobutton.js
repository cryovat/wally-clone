(function (main) {
    "use strict";

    if (!_.isObject(main)) {
        throw new Error("Undo button widget loaded before main Warry module");
    }

    main.addWidgetType("undobutton", function (button) {

        var history = main.getService("history");

        history.addEventListener("actionadded", function (e) {
            button.disabled = false;
        });

        history.addEventListener("historyundo", function (e) {
            button.disabled = history.isEmpty();
        });

        history.addEventListener("historyreset", function (e) {
            button.disabled = history.isEmpty();
        });

        button.addEventListener("click", function (e) {
            history.undo();
        });

    });

}(this.Warry));/**
 * Created with IntelliJ IDEA.
 * User: jarlerik
 * Date: 2/13/13
 * Time: 11:04 PM
 * To change this template use File | Settings | File Templates.
 */
