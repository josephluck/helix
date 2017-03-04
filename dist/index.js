"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Please note that the inelegance of this file is for the sake of performance
var rlite = require("rlite-router");
var href = require("sheet-router/href");
var createElement = require("inferno-create-element/dist/inferno-create-element");
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
function default_1(configuration) {
    return function mount(mount) {
        var morph = renderer(mount);
        var routes = configuration.routes ? wrap(configuration.routes, wrapRoutes) : null;
        var router = rlite(function () { return null; }, routes);
        var model = createModel(configuration, renderCurrentLocation);
        var store = twine_js_1.default(onStateChange)(model);
        var _state = store.state;
        var _prev = store.state;
        var _actions = store.actions;
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
        function getProps() {
            return { state: _state, prev: _prev, actions: _actions };
        }
        function applyHook(hook, defer) {
            if (defer === void 0) { defer = false; }
            if (!hook) {
                return null;
            }
            return function () {
                var args = [_state, _prev, _actions];
                if (defer) {
                    window.requestAnimationFrame(function () { return hook.apply(null, args); });
                }
                else {
                    hook.apply(null, args);
                }
            };
        }
        function wrapRoutes(route, handler) {
            var _handler = handler;
            if (typeof _handler === 'object') {
                _handler = function () {
                    var props = Object.assign({}, getProps(), {
                        onComponentDidMount: applyHook(handler.onMount),
                        onComponentDidUpdate: applyHook(handler.onUpdate, true),
                        onComponentWillUnmount: applyHook(handler.onUnmount, true),
                    });
                    return createElement(handler.view, props);
                };
            }
            return function (params, _, pathname) {
                if (_state.location.pathname !== pathname) {
                    _actions.location.receiveRoute({ pathname: pathname, params: params });
                    return false;
                }
                return _handler;
            };
        }
        function rerender(vnode) {
            if (vnode) {
                morph(getProps(), vnode);
            }
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
