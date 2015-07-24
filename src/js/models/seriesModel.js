/**
 * @fileoverview SeriesModel is model for management of series data.
 *               Series data used to draw the series area.
 * @author NHN Ent.
 *         FE Development Team <jiung.kang@nhnent.com>
 */

'use strict';

var Model = require('./model.js');

/**
 * @classdesc SeriesModel is model for management of series data.
 * @class
 * @augments Model
 */
var SeriesModel = ne.util.defineClass(Model, {
    /**
     * Constructor
     * @param {data} data
     */
    init: function(data, options) {
        /**
         * Series makers
         * @type {array}
         */
        this.markers = [];

        /**
         * Series percent values
         * @type {Array}
         */
        this.percentValues = [];

        /**
         * Axis scale
         * @type {{min: number, max: number}}
         */
        this.tickScale = {};

        /**
         * Series colors
         * @type {Array}
         */
        this.colors = [];

        /**
         * Series last item styles
         * @type {Array}
         */
        this.lastItemStyles = [];

        if (data) {
            this._setData(data);
        }
    },

    /**
     * Set series data.
     * @param {{values: array, scale: object, colors: array}} data series data
     * @private
     */
    _setData: function(data) {
        if (!data || ne.util.isEmpty(data.values) || !data.scale) {
            throw new Error('Invalid series data.');
        }

        this.markers = data.values;
        this.percentValues = this._makePercentValues(data.values, data.scale);

        if (ne.util.isNotEmpty(data.lastItemStyles)) {
            this.lastItemStyles = data.lastItemStyles;
        }
    },

    /**
     * Convert two dimensional(2d) array.
     * @param {[array, ...]} arr2d target 2d array
     * @param {function} callback convert callback function
     * @returns {array}
     * @private
     */
    _convertValues: function(arr2d, callback) {
        var result = ne.util.map(arr2d, function(arr) {
            return ne.util.map(arr, callback);
        });
        return result;
    },

    /**
     * Make to percent value.
     * @param {[array, ...]} arr2d maker data
     * @param {{min:number, max:number}} scale min, max scale
     * @returns {array}
     * @private
     */
    _makePercentValues: function(arr2d, scale) {
        var min = scale.min,
            max = scale.max,
            result = this._convertValues(arr2d, function(value) {
                return (value - min) / max;
            });
        return result;
    },

    /**
     * Make to pixel value.
     * @param {[array, ...]}arr2d percent data
     * @param {number} size width or height
     * @returns {array}
     */
    getPixelValues: function(size) {
        var result = this._convertValues(this.percentValues, function(value) {
            return value * size;
        });
        return result;
    },

    /**
     * Pick last colors.
     * @returns {array}
     */
    pickLastColors: function() {
        if (!this.lastItemStyles.length || !this.lastItemStyles[0]['color']) {
            return  [];
        }

        return ne.util.pluck(this.lastItemStyles, 'color');
    }

});

module.exports = SeriesModel;