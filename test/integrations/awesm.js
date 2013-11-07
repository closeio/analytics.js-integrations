
describe('awe.sm', function () {

  var assert = require('assert');
  var Awesm = require('integrations/lib/awesm');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var awesm;
  var settings = {
    apiKey: '5c8b1a212434c2153c2f2c2f2c765a36140add243bf6eae876345f8fd11045d9',
    events: { Test: 'goal_1' }
  };

  beforeEach(function () {
    awesm = new Awesm(settings);
    awesm.initialize(); // noop
    window.AWESMEXTRA = { capture_data: false };
  });

  afterEach(function () {
    awesm.reset();
  });

  it('should have the right settings', function () {
    test(awesm)
      .name('awe.sm')
      .assumesPageview()
      .readyOnLoad()
      .global('AWESM')
      .option('apiKey', '')
      .option('events', {});
  });

  describe('#initialize', function () {
    beforeEach(function () {
      awesm.load = sinon.spy();
    });

    it('should pass options to awe.sm', function () {
      awesm.initialize();
      assert(window.AWESM.api_key == settings.apiKey);
    });

    it('should call #load', function () {
      awesm.initialize();
      assert(awesm.load.called);
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(awesm, 'load');
      awesm.initialize();
      awesm.load.restore();
    });

    it('should set window.AWESM._exists', function (done) {
      awesm.load(function () {
        assert(window.AWESM._exists);
        done();
      });
    });
  });

  describe('#track', function () {
    beforeEach(function (done) {
      awesm.on('load', function () {
        window.AWESM.convert = sinon.spy();
        done();
      });
      awesm.initialize();
    });

    it('should convert an event to a goal', function () {
      awesm.track('Test', {});
      assert(window.AWESM.convert.calledWith('goal_1', 0));
    });

    it('should not convert an unknown event', function () {
      awesm.track('Unknown', {});
      assert(!window.AWESM.convert.called);
    });

    it('should accept a value property', function () {
      awesm.track('Test', { value: 1 });
      assert(window.AWESM.convert.calledWith('goal_1', 1));
    });

    it('should prefer a revenue property', function () {
      awesm.track('Test', { value: 1, revenue: 42.99 });
      assert(window.AWESM.convert.calledWith('goal_1', 4299));
    });
  });

});