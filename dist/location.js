"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function location(window) {
    return {
        scoped: true,
        state: {
            pathname: window.location.pathname,
            params: {},
        },
        reducers: {
            set: function (_state, _a) {
                var pathname = _a.pathname, params = _a.params;
                return { pathname: pathname, params: params };
            },
        },
        effects: {
            updateUrl: function (_state, _mathods, _a) {
                var pathname = _a.pathname;
                window.history.pushState('', '', pathname);
            },
        },
    };
}
exports.default = location;
