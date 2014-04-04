
describe('Navilytics', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var equal = require('equals');
  var Navilytics = require('integrations/lib/navilytics');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var navilytics;
  var settings = {
    mid: '1000',
    pid: '50'
  };

  beforeEach(function () {
    analytics.use(Navilytics);
    navilytics = new Navilytics.Integration(settings);
    navilytics.initialize(); // noop
  });

  afterEach(function () {
    navilytics.reset();
  });

  it('should have the right settings', function () {
    test(navilytics)
      .name('Navilytics')
      .assumesPageview()
      .readyOnLoad()
      .global('__nls')
      .option('mid', '')
      .option('pid', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      navilytics.load = sinon.spy();
    });

    it('should call #load', function () {
      navilytics.initialize();
      assert(navilytics.load.called);
    });
  });

  describe('#loaded', function () {
    it('should test __nls.push', function () {
      window.__nls = [];
      assert(!navilytics.loaded());
      window.__nls.push = function(){};
      assert(navilytics.loaded());
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(navilytics, 'load');
      navilytics.initialize();
      navilytics.load.restore();
    });

    it('should change loaded state', function (done) {
      assert(!navilytics.loaded());
      navilytics.load(function (err) {
        if (err) return done(err);
        assert(navilytics.loaded());
        done();
      });
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      window.__nls = [];
      sinon.stub(window.__nls, 'push');
    });

    it('should tag the recording', function () {
      test(navilytics).track('event');
      assert(window.__nls.push.calledWith(['tagRecording', 'event']));
    });
  });

});