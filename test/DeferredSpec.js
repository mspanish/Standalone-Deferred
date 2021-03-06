(function() {
  var root,
    __slice = Array.prototype.slice;

  root = this;

  describe("Deferred object", function() {
    it("Should initialize to state 'pending'", function() {
      var ready;
      ready = new Deferred();
      return expect(ready.state()).toEqual('pending');
    });
    it("Should move to 'resolved' state when resolved", function() {
      var ready;
      ready = new Deferred();
      ready.resolve();
      return expect(ready.state()).toEqual('resolved');
    });
    it("Should move to 'rejected' state when rejected", function() {
      var ready;
      ready = new Deferred();
      ready.reject();
      return expect(ready.state()).toEqual('rejected');
    });
    it("Should not change state after resolving or rejecting", function() {
      var ready;
      ready = new Deferred();
      ready.resolve();
      ready.reject();
      expect(ready.state()).toEqual('resolved');
      ready = new Deferred();
      ready.reject();
      ready.resolve();
      return expect(ready.state()).toEqual('rejected');
    });
    it("Should execute done and always callback after resolving and not execute fail callback", function() {
      var alwaysFired, doneFired, failFired, ready;
      doneFired = 0;
      failFired = 0;
      alwaysFired = 0;
      ready = new Deferred();
      ready.done(function() {
        return doneFired += 1;
      }).fail(function() {
        return failFired += 1;
      }).always(function() {
        return alwaysFired += 1;
      });
      ready.resolve();
      expect(doneFired).toEqual(1);
      expect(failFired).toEqual(0);
      return expect(alwaysFired).toEqual(1);
    });
    it("Should execute fail and always callback after rejecting and not execute done callback", function() {
      var alwaysFired, doneFired, failFired, ready;
      doneFired = 0;
      failFired = 0;
      alwaysFired = 0;
      ready = new Deferred();
      ready.done(function() {
        return doneFired += 1;
      }).fail(function() {
        return failFired += 1;
      }).always(function() {
        return alwaysFired += 1;
      });
      ready.reject();
      expect(doneFired).toEqual(0);
      expect(failFired).toEqual(1);
      return expect(alwaysFired).toEqual(1);
    });
    it("Should execute callbacks added with then", function() {
      var doneFired, failFired, ready;
      doneFired = 0;
      failFired = 0;
      ready = new Deferred();
      ready.then(function() {
        return doneFired += 1;
      }, function() {
        return failFired += 1;
      });
      ready.resolve();
      expect(doneFired).toEqual(1);
      return expect(failFired).toEqual(0);
    });
    it("Should execute done after resolve immediately and not execute fail at all", function() {
      var alwaysFired, doneFired, failFired, ready;
      doneFired = 0;
      failFired = 0;
      alwaysFired = 0;
      ready = new Deferred();
      ready.resolve();
      ready.done(function() {
        return doneFired += 1;
      }).fail(function() {
        return failFired += 1;
      }).always(function() {
        return alwaysFired += 1;
      });
      expect(doneFired).toEqual(1);
      expect(failFired).toEqual(0);
      return expect(alwaysFired).toEqual(1);
    });
    it("Should resolve and reject with context", function() {
      var context, ready;
      context = new Array();
      ready = new Deferred();
      ready.done(function() {
        return expect(this).toEqual(context);
      });
      ready.resolveWith(context);
      ready = new Deferred();
      ready.reject(function() {
        return expect(this).toEqual(context);
      });
      return ready.rejectWith(context);
    });
    it("Should resolve with arguments", function() {
      var ready;
      ready = new Deferred();
      ready.done(function(firstArg, secondArg) {
        expect(firstArg).toEqual(123);
        expect(secondArg).toEqual('foo');
        return expect(this).toEqual(root);
      });
      return ready.resolve(123, 'foo');
    });
    it("Should reject with arguments", function() {
      var context, ready;
      context = new Array();
      ready = new Deferred();
      ready.fail(function(firstArg, secondArg) {
        expect(firstArg).toEqual(123);
        expect(secondArg).toEqual('foo');
        return expect(this).toEqual(context);
      });
      return ready.rejectWith(context, 123, 'foo');
    });
    it("Should fire done with context and arguments after resolving", function() {
      var context, ready;
      context = new Array();
      ready = new Deferred();
      ready.resolveWith(context, 12345);
      return ready.done(function(arg) {
        expect(arg).toEqual(12345);
        return expect(this).toEqual(context);
      });
    });
    return it("Should execute fn passed to constructor", function() {
      var executed, passedParam, ready;
      executed = 0;
      passedParam = null;
      ready = new Deferred(function(param) {
        passedParam = param;
        return this.done(function() {
          return executed += 1;
        });
      });
      ready.resolve();
      expect(executed).toEqual(1);
      return expect(passedParam).toEqual(ready);
    });
  });

  describe("Promise object", function() {
    it("Should be given from deferred", function() {
      var promise, ready;
      ready = new Deferred();
      promise = ready.promise();
      return expect(promise.constructor.name).toEqual('Promise');
    });
    it("Should execute done and always when deferred is resolved", function() {
      var alwaysFired, doneFired, failFired, promise, ready;
      doneFired = 0;
      failFired = 0;
      alwaysFired = 0;
      ready = new Deferred();
      promise = ready.promise();
      promise.done(function() {
        return doneFired += 1;
      }).fail(function() {
        return failFired += 1;
      }).always(function() {
        return alwaysFired += 1;
      });
      ready.resolve();
      expect(doneFired).toEqual(1);
      expect(failFired).toEqual(0);
      return expect(alwaysFired).toEqual(1);
    });
    return it("Should reject with correct context", function() {
      var context, failFired, promise, ready;
      failFired = 0;
      context = new Array();
      ready = new Deferred();
      promise = ready.promise();
      ready.rejectWith(context, 1234, 'foo');
      promise.fail(function(firstArg, secondArg) {
        expect(this).toEqual(context);
        expect(firstArg).toEqual(1234);
        expect(secondArg).toEqual('foo');
        return failFired += 1;
      });
      return expect(failFired).toEqual(1);
    });
  });

  describe("Deferred.when", function() {
    it("Should give back a resolved promise object when called without arguments", function() {
      var promise;
      promise = Deferred.when();
      expect(promise.constructor.name).toEqual('Promise');
      return expect(promise.state()).toEqual('resolved');
    });
    it("Should return single deferred's promise", function() {
      var promise, ready;
      ready = new Deferred();
      promise = Deferred.when(ready);
      return expect(promise).toEqual(ready.promise());
    });
    it("Should resolve when all deferreds resolve", function() {
      var deferreds, doneFired, promise;
      deferreds = [new Deferred(), new Deferred(), new Deferred()];
      doneFired = 0;
      promise = Deferred.when(deferreds[0], deferreds[1], deferreds[2]);
      promise.done(function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        expect(args).toEqual([[1, 2], [3, 4], [5, 6]]);
        return doneFired += 1;
      });
      deferreds[1].resolve(3, 4);
      expect(promise.state()).toEqual('pending');
      deferreds[0].resolve(1, 2);
      expect(promise.state()).toEqual('pending');
      deferreds[2].resolve(5, 6);
      expect(promise.state()).toEqual('resolved');
      return expect(doneFired).toEqual(1);
    });
    return it("Should reject when first deferred rejects", function() {
      var deferreds, failFired, promise;
      deferreds = [new Deferred(), new Deferred(), new Deferred()];
      failFired = 0;
      promise = Deferred.when(deferreds[0], deferreds[1], deferreds[2]);
      promise.fail(function(firstArg, secondArg) {
        expect(firstArg).toEqual('foo');
        expect(secondArg).toEqual(1234);
        return failFired += 1;
      });
      deferreds[0].resolve();
      expect(promise.state()).toEqual('pending');
      deferreds[1].reject('foo', 1234);
      expect(promise.state()).toEqual('rejected');
      return expect(failFired).toEqual(1);
    });
  });

  describe('Deferred.pipe()', function() {
    it("Should fire normally without parameters", function() {
      var context, deferred, doneFired, failFired, param;
      doneFired = 0;
      failFired = 0;
      param = 'foo';
      context = new Array();
      deferred = new Deferred();
      deferred.pipe().done(function(value) {
        expect(value).toEqual(param);
        expect(this).toEqual(context);
        return doneFired += 1;
      }).fail(function(value) {
        return failFired += 1;
      });
      deferred.resolveWith(context, param);
      expect(doneFired).toEqual(1);
      expect(failFired).toEqual(0);
      deferred = new Deferred();
      deferred.pipe().done(function(value) {
        return doneFired += 1;
      }).fail(function(value) {
        expect(value).toEqual(param);
        expect(this).toEqual(context);
        return failFired += 1;
      });
      deferred.rejectWith(context, param);
      expect(doneFired).toEqual(1);
      return expect(failFired).toEqual(1);
    });
    it("Should filter with function", function() {
      var context, deferred, doneFired, failFired, param1, param2;
      doneFired = 0;
      failFired = 0;
      param1 = 'foo';
      param2 = 'bar';
      context = new Array();
      deferred = new Deferred();
      deferred.pipe(function(string1, string2) {
        expect(string1).toEqual(param1);
        expect(string2).toEqual(param2);
        return string1 + string2;
      }).done(function(value) {
        expect(value).toEqual(param1 + param2);
        expect(this).toEqual(context);
        return doneFired += 1;
      }).fail(function(value) {
        return failFired += 1;
      });
      deferred.resolveWith(context, param1, param2);
      expect(doneFired).toEqual(1);
      expect(failFired).toEqual(0);
      deferred = new Deferred();
      deferred.pipe(null, function(string1, string2) {
        expect(string1).toEqual(param1);
        expect(string2).toEqual(param2);
        return string1 + string2;
      }).done(function(value) {
        return doneFired += 1;
      }).fail(function(value) {
        expect(value).toEqual(param1 + param2);
        expect(this).toEqual(context);
        return failFired += 1;
      });
      deferred.rejectWith(context, param1, param2);
      expect(doneFired).toEqual(1);
      return expect(failFired).toEqual(1);
    });
    return it('Should filter with another observable', function() {
      var context, deferred, doneFired, failFired, param1, param2, pipeDeferred;
      doneFired = 0;
      failFired = 0;
      param1 = 'foo';
      param2 = 'bar';
      context = new Array();
      deferred = new Deferred();
      pipeDeferred = new Deferred();
      deferred.pipe(function(string1, string2) {
        expect(string1).toEqual(param1);
        expect(string2).toEqual(param2);
        return pipeDeferred.rejectWith(this, string1, string2).promise();
      }).fail(function(passed1, passed2) {
        expect(passed1).toEqual(param1);
        expect(passed2).toEqual(param2);
        expect(this).toEqual(context);
        return failFired += 1;
      }).done(function(value) {
        return doneFired += 1;
      });
      deferred.resolveWith(context, param1, param2);
      expect(doneFired).toEqual(0);
      expect(failFired).toEqual(1);
      deferred = new Deferred();
      pipeDeferred = new Deferred();
      deferred.pipe(null, function(string1, string2) {
        expect(string1).toEqual(param1);
        expect(string2).toEqual(param2);
        return pipeDeferred.resolveWith(context, param1, param2);
      }).fail(function(value) {
        return failFired += 1;
      }).done(function(passed1, passed2) {
        expect(passed1).toEqual(param1);
        expect(passed2).toEqual(param2);
        expect(this).toEqual(context);
        return doneFired += 1;
      });
      deferred.reject(param1, param2);
      expect(doneFired).toEqual(1);
      return expect(failFired).toEqual(1);
    });
  });

  describe('Progress and notify', function() {
    return it('Should notify with correct context', function() {
      var context, def, param1, param2, progressCalled;
      def = new Deferred();
      context = new Array();
      param1 = 'foo';
      param2 = 'bar';
      progressCalled = 0;
      def.progress(function(value1, value2) {
        progressCalled += 1;
        expect(value1).toEqual(param1);
        expect(value2).toEqual(param2);
        return expect(this).toEqual(context);
      });
      def.notifyWith(context, param1, param2);
      def.notifyWith(context, param1, param2);
      expect(progressCalled).toEqual(2);
      def.resolve();
      def.notify();
      return expect(progressCalled).toEqual(2);
    });
  });

}).call(this);
