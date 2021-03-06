
var alias = require('alias');
var callback = require('callback');
var convertDates = require('convert-dates');
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_lnq');


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Preact);
};


/**
 * Expose `Preact` integration.
 */

var Preact = exports.Integration = integration('Preact')
  .assumesPageview()
  .readyOnInitialize()
  .global('_lnq')
  .option('projectCode', '');


/**
 * Initialize.
 *
 * http://www.preact.io/api/javascript
 *
 * @param {Object} page
 */

Preact.prototype.initialize = function (page) {
  window._lnq = window._lnq || [];
  push('_setCode', this.options.projectCode);
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Preact.prototype.loaded = function () {
  return !! (window._lnq && window._lnq.push !== Array.prototype.push);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Preact.prototype.load = function (callback) {
  load('//d2bbvl6dq48fa6.cloudfront.net/js/ln-2.4.min.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Preact.prototype.identify = function (id, traits, options) {
  if (!id) return;
  traits = traits || {};
  traits = convertDates(traits, convertDate);
  traits = alias(traits, { created: 'created_at' });
  push('_setPersonData', {
    name: traits.name,
    email: traits.email,
    uid: id,
    properties: traits
  });
};


/**
 * Group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Preact.prototype.group = function (id, properties, options) {
  if (!id) return;
  properties || ( properties = {});
  properties.id = id;
  push('_setAccount', properties);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Preact.prototype.track = function (event, properties, options) {
  properties || (properties = {});
  var special = {};
  special.name = event;
  if (properties.revenue) {
    special.revenue = properties.revenue * 100;
    delete properties.revenue;
  }
  if (properties.note) {
    special.note = properties.note;
    delete properties.note;
  }
  push('_logEvent', special, properties);
};


/**
 * Convert a `date` to a format Preact supports.
 *
 * @param {Date} date
 * @return {Number}
 */

function convertDate (date) {
  return Math.floor(date / 1000);
}