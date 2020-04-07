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
    
    
    // plugin
    $.fn.chartify = function(action, options) {
        /**
         * Action as an object is essentially the `create` action.
         * Action Strings can be:
         * - `instance`: Gets the chart instance from the element.
         * - `update`: To update a chart with an alternative data set or options.
         *  (Options requires destroying the chart)
         * - `destroy`: Removes the chart instance.
         * 
         * Options should be object with:
         * - `type`: String chart type.
         * - `options`: Chart js options object OR function to return such.
         * - `data`: Object matching Chart js data OR function returning such.
         */
        var $target = this;
        if (this.length > 1) $target = $($target[0]);
        var id = $target.data('jcid');


        if (typeof action === "object" && !Array.isArray(action)) {
            if (!id) id = $.chartify.genID();

            if ($.chartify.getInstance(id)) $.chartify.update($target, action);
            else $.chartify.create($target, action, id);  // init
        } else {
            switch (action) {
                case "instance":
                    // Returns chart instance.
                    return $.chartify.getInstance(id);
                case "update":
                    if (charts[id]) $.chartify.update($target, options);
                    else $.chartify.create($target, options);
                    break;
                case "destroy":
                    if (charts[id]) $.chartify.destroy($target);
                    break;
                default: 
                    console.warn("Unrecognised action, ignoring.");
            }
        }
        return this;
    };
    $.chartify = {
        // var
        _instances: {},
        // func
        create: function(elem, options, id) {
            // Create a chart
            elem.data('jcid', id);
            var ctx = elem[0].getContext('2d');
            var opts = options.options;
            var data = options.data;
            var charttype = options.type;
            // Get data and options
            if (typeof data === "function") data = data();
            if (typeof opts === "function") opts = opts();

            // Finally create chart and add to store
            $.chartify._instances[id] = new Chart(ctx, {type: charttype, data: data, options: opts});
        },
        update: function(elem, options) {
            // Update the instance
            var ctx = elem[0].getContext('2d');
			var id = elem.data('jcid');
            var opts = options.options;
            var data = options.data;
            var charttype = options.type;
            var currentInstance = $.chartify.getInstance(id);

            // Get data and options
            if (typeof data === "function") data = data();
            if (typeof opts === "function") opts = opts();

            // To prevent data disappearing when not given on update, 
            // use the instances current set.
            if (!data) data = currentInstance.data;

            // Create if undef
            if (!currentInstance) {
                $.chartify._instances[id] = new Chart(ctx, {type: charttype, data: data, options: opts});
                return;
            }

            // Finally create chart and add to store
            if (opts || charttype) {
                // Need to destroy and remake for options or type
                currentInstance.destroy();
                $.chartify._instances[id] = new Chart(ctx, {type: charttype, data: data, options: opts});
            } else {
                // Just update the data for data only
                currentInstance.data = data;
                currentInstance.update();
            }
        },
        destroy: function(elem) {
            // Destroy the chart instance attached to this chart.
            var id = elem.data('jcid');
            var currentInstance = $.chartify.getInstance(id);

            if (currentInstance) currentInstance.destroy();
            delete currentInstance;
            delete $.chartify._instances[id];
        },
        // util
        genID: function() {
            var b = 'jc';
            var t = Date.now();

            while ($.chartify._instances[b+t]) { t = Date.now(); }

            return b + t;
        },
        getInstance: function(id) {
            // Return the chart object (or undefined)
            return $.chartify._instances[id];
        },
    };
})(jQuery);