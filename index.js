
var each = require('each');


/**
 * A list all of our integration slugs.
 */

var integrations = [
  "adroll.js",
  "customerio.js",
  "errorception.js",
  "google-analytics.js",
  "hubspot.js",
  "intercom.js",
  "kissmetrics.js",
  "mixpanel.js",
  "olark.js",
  "sentry.js"
];


/**
 * Expose the integrations, using their own `name` from their `prototype`.
 */

each(integrations, function (slug) {
  var plugin = require('./lib/' + slug);
  var name = plugin.Integration.prototype.name;
  exports[name] = plugin;
});
