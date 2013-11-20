This branch contains the custom build of Analytics.js Integrations for Close.io. See also [elasticsales/analytics.js](https://github.com/elasticsales/analytics.js).

### How to add/remove integrations

 - Add/remove the relevant lines from `component.json` and `index.js` - keep them in sync. Make sure the `.json` is valid JSON (no comments, etc.).
 - Run `make` to compile and `make test` to run tests.
 - Then you'll need to rebuild analytics.js from our [elasticsales/analytics.js](https://github.com/elasticsales/analytics.js) fork. 

### One-time setup:

`npm install -g component`

