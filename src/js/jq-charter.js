/**
 * Combining Chart.js and jQuery with a plugin for 
 * ease of use.
 * 
 * Creating charts on already instanced charts will instead
 * invoke an update with new options and data.
 * Destroying a chart uses Chart.js' destroy function to
 * return your canvas to pre-init state.
 * 
 * Creating a chart:
 * `$(element).chartify(options);`
 * Updating a chart:
 * `$(element).chartify('update', options);`
 * Destroying a chart:
 * `$(element).chartify('destroy');`
 */
var chartifyDefaults = {
    chartColours: [],
};

(function($) {
    // Chart storage, can be exposed with a call.
    var charts = {};
    // default values

    // functions
    fn = {
        create: function() {
            // Create a chart
        },
        update: function() {
            // Update the instance
        },
        destroy: function() {
            // Destroy the chart instance attached to this chart.
        },
        getInstance: function(id) {
            // Getting chart instances
            if (!id) return charts;
            return charts[id];
        },
    };

    // plugin
    $.fn.chartify = function(action, options) {
        /**
         * Action as an object is essentially the `create` action.
         * Action Strings can be:
         * - `create`: Same as action as object, initialises a new chart on element.
         * - `update`: To update a chart with an alternative data set or options.
         *  (Options requires destroying the chart)
         * - `getInstance`: Gets the chart instance from the element.
         * - `destroy`: Removes the chart instance.
         * 
         * Options should be object with:
         * - `type`: String chart type.
         * - `options`: Chart js options object OR function to return such.
         * - `data`: Object of `{label: dataArray}` OR function returning such.
         * - `dataOrder`: Array of string `labels` matching `data` keys to explicitly specify an order.
         *  (typically used for matching colour array with specific data)
         * - `colours`: Array of colours to use in place of defaults.
         * - `labels`: Labels for X axis. (E.g. dates)
         */
        if (action === "getInstance")
            return 
        return this.each(function() {
            var id = this.id;
            console.log("my id is:", id);
            if (!id) throw Error("Element has no unique ID.");

            if (typeof action === "object" && !Array.isArray(action)) {
                fn.create(this, options);  // init
            } else {
                switch (action) {
                    case "create":
                        if (charts[id]) fn.update(this, options);
                        else fn.create(this, options);
                        break;
                    case "update":
                        if (charts[id]) fn.update(this, options);
                        else fn.create(this, options);
                        break;
                    case "destroy":
                        if (charts[id]) fn.destroy(this);
                        break;
                    default: 
                        console.warn("Unrecognised action, ignoring.");
                }
            }
        });
    };

})(jQuery);