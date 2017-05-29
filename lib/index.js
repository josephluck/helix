"use strict";
exports.__esModule = true;
var rlite = require("rlite-router");
var href = require("sheet-router/href");
var qs = require("qs");
var twine_js_1 = require("twine-js");
var twineLog = require("twine-js/lib/log");
exports.log = twineLog["default"];
function combineObjects(a, b) {
    return Object.assign({}, a, b);
}
function wrap(routes, fn) {
    return Object.keys(routes).map(function (key) {
        var route = routes[key];
        return _a = {},
            _a[key] = fn(key, route),
            _a;
        var _a;
    }).reduce(combineObjects, {});
}
function createModel(model, routes, render) {
    if (routes) {
        if (model.models) {
            model.models.location = location(render);
        }
        else {
            model.models = {
                location: location(render)
            };
        }
    }
    return model;
}
function getQueryFromLocation(search) {
    return search.length ? qs.parse(search.slice(1)) : {};
}
function location(rerender) {
    return {
        state: {
            pathname: '',
            params: {}
        },
        reducers: {
            receiveRoute: function (_state, _a) {
                var pathname = _a.pathname, params = _a.params;
                return { pathname: pathname, params: params };
            }
        },
        effects: {
            set: function (_state, _actions, pathname) {
                window.history.pushState('', '', pathname);
                rerender(pathname);
            }
        }
    };
}
function default_1(configuration) {
    var routes = configuration.routes ? wrap(configuration.routes, wrapRoutes) : null;
    var notFound = configuration.routes && configuration.routes.notFound ? configuration.routes.notFound : function () { return null; };
    var router = rlite(notFound, routes);
    var model = createModel(configuration.model, configuration.routes, renderCurrentLocation);
    var plugins = [onStateChange].concat(configuration.plugins || []);
    var store = twine_js_1["default"](plugins)(model);
    var render = configuration.render;
    var _state = store.state;
    var _prev = store.state;
    var _actions = store.actions;
    var _onLeave;
    var _handler;
    function rerender(node) {
        render(node, _state, _prev, _actions);
    }
    function onStateChange(state, prev, actions) {
        _state = state;
        _prev = prev;
        _actions = actions;
        rerender(getComponent(window.location.pathname));
    }
    function getComponent(path) {
        if (configuration.routes) {
            return router(path);
        }
        else {
            return configuration.component ? configuration.component : null;
        }
    }
    function lifecycle(handler) {
        if (_handler === handler) {
            if (handler.onUpdate) {
                handler.onUpdate(_state, _prev, _actions);
            }
        }
        else {
            _handler = handler;
            if (_onLeave) {
                _onLeave(_state, _prev, _actions);
                _onLeave = handler.onLeave;
            }
            if (handler.onEnter) {
                handler.onEnter(_state, _prev, _actions);
            }
        }
    }
    function wrapRoutes(route, handler) {
        var view = typeof handler === 'object' ? handler.view : handler;
        return function (params, _, pathname) {
            if (_state.location.pathname !== pathname) {
                var query = getQueryFromLocation(window.location.search);
                _actions.location.receiveRoute({ pathname: pathname, params: Object.assign({}, params, query) });
                lifecycle(handler);
                _onLeave = handler.onLeave;
                return false;
            }
            return view;
        };
    }
    function renderCurrentLocation() {
        rerender(getComponent(window.location.pathname));
    }
    function setLocationAndRender(location) {
        var search = Object.keys(location.search).length ? "?" + qs.stringify(location.search, { encode: false }) : '';
        var path = "" + location.pathname + search;
        window.history.pushState('', '', path);
        rerender(getComponent(location.pathname));
    }
    href(setLocationAndRender);
    window.onpopstate = renderCurrentLocation;
    renderCurrentLocation();
    return _actions;
}
exports["default"] = default_1;
