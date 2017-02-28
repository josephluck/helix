"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function location(rerender) {
    return {
        state: {
            pathname: window.location.pathname,
            params: {},
        },
        reducers: {
            receiveRoute: function (_state, _a) {
                var pathname = _a.pathname, params = _a.params;
                return { pathname: pathname, params: params };
            },
        },
        effects: {
            set: function (_state, _actions, pathname) {
                rerender(pathname);
                window.history.pushState('', '', pathname);
            },
        },
    };
}
exports.default = location;
