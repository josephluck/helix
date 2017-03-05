"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Please note that the inelegance of this file is for the sake of performance
var rlite = require("rlite-router");
var href = require("sheet-router/href");
var qs = require("query-string-json");
var twine_js_1 = require("twine-js");
var html_1 = require("./html");
var location_1 = require("./location");
function combineObjects(a, b) {
    return Object.assign({}, a, b);
}
function wrap(routes, wrap) {
    return Object.keys(routes).map(function (route) {
        var handler = routes[route];
        return _a = {},
            _a[route] = wrap(route, handler),
            _a;
        var _a;
    }).reduce(combineObjects, {});
}
function createModel(configuration, render) {
    var model = configuration.model;
    if (configuration.routes) {
        if (model.models) {
            model.models.location = location_1.default(render);
        }
        else {
            model.models = {
                location: location_1.default(render),
            };
        }
    }
    return model;
}
function getQueryFromLocation(location) {
    var query = qs.parse(location);
    if (query) {
        return Object.keys(query).map(function (key) {
            return _a = {}, _a[key] = query[key][0], _a;
            var _a;
        }).reduce(function (curr, prev) { return Object.assign({}, prev, curr); });
    }
    return {};
}
function default_1(configuration) {
    return function mount(mount) {
        var routes = configuration.routes ? wrap(configuration.routes, wrapRoutes) : null;
        var router = rlite(function () { return null; }, routes);
        var model = createModel(configuration, renderCurrentLocation);
        var store = twine_js_1.default(onStateChange)(model);
        var _dom = mount;
        var _state = store.state;
        var _prev = store.state;
        var _actions = store.actions;
        var _onLeave;
        var _handler;
        function rerender(node) {
            if (node) {
                _dom = html_1.default.update(_dom, node(_state, _prev, _actions));
            }
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
                    var query = getQueryFromLocation(window.location.href);
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
        function setLocationAndRender(path) {
            window.history.pushState('', '', path.pathname);
            rerender(getComponent(path.pathname));
        }
        href(setLocationAndRender);
        window.onpopstate = renderCurrentLocation;
        renderCurrentLocation();
    };
}
exports.default = default_1;
