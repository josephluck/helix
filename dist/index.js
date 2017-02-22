'use strict';

var tansu = require('tansu');
var html = require('./html');
var sheetRouter = require('sheet-router');
var walk = require('sheet-router/walk');
var href = require('sheet-router/href');

function createModel(model) {
  return Object.assign({}, model, {
    models: Object.assign({}, model.models, {
      location: {
        state: window.location,
        reducers: {
          set: function set(state, location) {
            window.history.pushState('', '', location);
            return Object.assign({}, state, {
              location: window.location
            });
          }
        }
      }
    })
  });
}

module.exports = function (opts) {
  if (opts.model.models) {
    opts.model.models = {};
  }
  var model = createModel(opts.model);
  var routes = opts.routes;
  var router = sheetRouter({ thunk: 'match' }, routes);

  var dom = void 0;

  return function () {
    var state = void 0;
    var prev = void 0;

    function subscribe(_state, _prev) {
      state = _state;
      prev = _prev;
      router(window.location.href);
    }

    var store = tansu(subscribe)(model);

    state = store.state;
    prev = store.state;

    walk(router, function (route, handler) {
      return function (params) {
        return function () {
          var newDom = handler(state, prev, store.methods);
          if (dom) {
            dom = html.update(dom, newDom);
          }
          return newDom;
        };
      };
    });

    href(function (href) {
      store.methods.location.set(href.pathname);
    });

    dom = router(window.location.href);
    return dom;
  };
};