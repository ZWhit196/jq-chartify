/**
 * Combining Chart.js and jQuery with a plugin for 
 * ease of use.
 * 
 * Creating charts on already instanced charts will instead
 * invoke an update with new options and data.
 * Updating a chart that doesn't exist creates it instead.
 * Destroying a chart uses Chart.js' destroy function to
 * return your canvas to pre-init state.
 * You can gain access to the Chart js instances by using
 * the `getInstances` action.
 * 
 * Creating a chart:
 * `$(element).chartify(options);` OR
 * `$(element).chartify('create', options);`
 * Updating a chart:
 * `$(element).chartify('update', options);`
 * Destroying a chart:
 * `$(element).chartify('destroy');`
 * Get the current chart instances:
 * `$(element).chartify('getInstances');`
 */
(function($) {
    // Chart storage, can be exposed with a call.
    var charts = {};
    // functions
    fn = {
        // Main
        create: function(elem, options) {
            // Create a chart
            var ctx = elem.getContext('2d'),
                id = elem.id,
                opts = options.options,
                data = options.data,
                charttype = options.type;
            // Get data and options
            if (typeof data === "function") data = data();
            if (typeof opts === "function") opts = opts();

            // Finally create chart and add to store
            charts[id] = new Chart(ctx, {type: charttype, data: data, options: opts});
        },
        update: function(elem, options) {
            // Update the instance
            var ctx = elem.getContext('2d'),
				id = elem.id,
                opts = options.options,
                data = options.data,
                charttype = options.type,
                currentInstance = charts[id];

            // Get data and options
            if (typeof data === "function") data = data();
            if (typeof opts === "function") opts = opts();

            // Create if undef
            if (!currentInstance) {
                charts[id] = new Chart(ctx, {type: charttype, data: data, options: opts});
                return;
            }

            // Finally create chart and add to store
            if (opts || charttype) {
                // Need to destroy and remake for options or type
                currentInstance.destroy();
                charts[id] = new Chart(ctx, {type: charttype, data: data, options: opts});
            } else {
                // Just update the data for data only
                currentInstance.data = data;
                currentInstance.update();
            }
        },
        destroy: function(elem) {
            // Destroy the chart instance attached to this chart.
            var id = elem.id,
                currentInstance = charts[id];

            if (currentInstance) currentInstance.destroy();
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
         * - `data`: Object matching Chart js data OR function returning such.
         */
        if (action === "getInstances") return charts;
        return this.each(function() {
            var id = this.id;
            if (!id) throw Error("Element has no unique ID.");

            if (typeof action === "object" && !Array.isArray(action)) {
                fn.create(this, action);  // init
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