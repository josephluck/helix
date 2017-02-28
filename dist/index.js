"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Please note that the inelegance of this file is for the sake of performance
var rlite = require("rlite-router");
var href = require("sheet-router/href");
var twine_js_1 = require("twine-js");
var html_1 = require("./html");
var location_1 = require("./location");
function renderer(mount) {
    return function (props, vnode) {
        html_1.default.render(vnode(props), mount);
    };
}
function combineObjects(a, b) {
    return Object.assign({}, a, b);
}
function wrapRoutes(routes, wrap) {
    return Object.keys(routes).map(function (route) {
        var handler = routes[route];
        return _a = {},
            _a[route] = wrap(route, handler),
            _a;
        var _a;
    }).reduce(combineObjects, {});
}
function default_1(configuration) {
    return function mount(mount) {
        var morph = renderer(mount);
        var model = configuration.model;
        var routes = configuration.routes ? wrapRoutes(configuration.routes, decorateRoutesInLocationHandler) : null;
        var renderView = configuration.routes ? rlite(function () { return null; }, routes) : null;
        var renderComponent = configuration.component ? configuration.component : null;
        if (configuration.routes) {
            model.models.location = location_1.default(renderCurrentLocation);
        }
        var store = twine_js_1.default(onStateChange)(model);
        var _state = store.state;
        var _prev = store.state;
        var _actions = store.actions;
        href(setLocationAndRender);
        window.onpopstate = renderCurrentLocation;
        renderCurrentLocation();
        function renderCurrentLocation() {
            var component = renderView ? renderView(window.location.pathname) : renderComponent;
            renderPage(component);
        }
        function decorateRoutesInLocationHandler(route, handler) {
            return function (params, _, pathname) {
                if (_state.location.pathname !== pathname) {
                    _actions.location.receiveRoute({ pathname: pathname, params: params });
                    return false;
                }
                return handler;
            };
        }
        function renderPage(vnode) {
            var props = { state: _state, prev: _prev, actions: _actions };
            if (vnode) {
                morph(props, vnode);
            }
        }
        function onStateChange(state, prev, actions) {
            _state = state;
            _prev = prev;
            _actions = actions;
            var component = renderView ? renderView(window.location.pathname) : renderComponent;
            renderPage(component);
        }
        function setLocationAndRender(path) {
            window.history.pushState('', '', path.pathname);
            renderPage(renderView ? renderView(path.pathname) : null);
        }
    };
}
exports.default = default_1;
