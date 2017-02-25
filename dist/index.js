Object.defineProperty(exports, "__esModule", { value: true });
var rlite = require("rlite-router");
var href = require("sheet-router/href");
var tansu = require("tansu");
var html_1 = require("./html");
var location_1 = require("./location");
function renderer(mount) {
    var curr;
    return function (props, vnode) {
        curr = html_1.default.render(html_1.default.h(vnode, props), mount, curr);
    };
}
// Takes Tansu.Model and returns a Tansu.Model
function makeModel(model) {
    return Object.assign({}, model, {
        models: Object.assign({}, model.models, {
            location: location_1.default(window),
        }),
    });
}
function combineObjects(a, b) {
    return Object.assign({}, a, b);
}
function wrapRoutes(routes, wrap) {
    return Object.keys(routes).map(function (key) {
        var route = routes[key];
        return _a = {},
            _a[key] = wrap(key, route),
            _a;
        var _a;
    }).reduce(combineObjects, {});
}
function default_1(configuration) {
    return function mount(mount) {
        var morph = renderer(mount);
        var model = makeModel(configuration.model);
        var routes = wrapRoutes(configuration.routes, wrapper);
        var router = rlite(function () { return null; }, routes);
        var store = tansu(subscribe)(model);
        var _state = store.state;
        var _prev = store.prev;
        var _methods = store.methods;
        function wrapper(route, handler) {
            var currentPath = window.location.pathname;
            return function (params, _, newPath) {
                if (currentPath !== newPath) {
                    currentPath = newPath;
                    store.methods.location.set({ pathname: newPath, params: params });
                }
                return handler;
            };
        }
        function render(state, prev, methods, vnode) {
            var props = { state: state, prev: prev, methods: methods };
            return morph(props, vnode);
        }
        function subscribe(state, prev, methods) {
            _state = state;
            _prev = prev;
            _methods = methods;
            return render(state, prev, methods, router(window.location.pathname));
        }
        href(function (path) {
            store.methods.location.updateUrl({ pathname: path.pathname });
            render(_state, _state, _methods, router(path.pathname));
        });
        render(store.state, store.state, store.methods, router(store.state.location.pathname));
    };
}
exports.default = default_1;
