
var alias = require('alias');
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Lytics);
};


/**
 * Expose `Lytics` integration.
 */

var Lytics = exports.Integration = integration('Lytics')
  .assumesPageview()
  .readyOnInitialize()
  .global('jstag')
  .option('cid', '')
  .option('cookie', 'seerid')
  .option('delay', 200)
  .option('sessionTimeout', 1800)
  .option('url', '//c.lytics.io');


/**
 * Options aliases.
 */

var aliases = {
  sessionTimeout: 'sessecs'
};


/**
 * Initialize.
 *
 * http://admin.lytics.io/doc#jstag
 *
 * @param {Object} page
 */

Lytics.prototype.initialize = function (page) {
  var options = alias(this.options, aliases);
  window.jstag = (function () {var t = {_q: [], _c: options, ts: (new Date()).getTime() }; t.send = function() {this._q.push([ 'ready', 'send', Array.prototype.slice.call(arguments) ]); return this; }; return t; })();
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Lytics.prototype.loaded = function () {
  return !! (window.jstag && window.jstag.bind);
};


/**
 * Load the Lytics library.
 *
 * @param {Function} callback
 */

Lytics.prototype.load = function (callback) {
  load('//c.lytics.io/static/io.min.js', callback);
};


/**
 * Page.
 *
 * @param {String} category (optional)
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Lytics.prototype.page = function (category, name, properties, optional) {
  properties = properties || {};
  window.jstag.send(properties);
};


/**
 * Idenfity.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Lytics.prototype.identify = function (id, traits, options) {
  traits = traits || {};
  if (id) traits._uid = id;
  window.jstag.send(traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Lytics.prototype.track = function (event, properties, options) {
  properties = properties || {};
  properties._e = event;
  window.jstag.send(properties);
};