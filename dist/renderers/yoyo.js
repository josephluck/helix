"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yoyo = require("yo-yo");
exports.default = yoyo;
function renderer(dom) {
    var _dom = dom;
    return function (node, state, prev, actions) {
        if (node) {
            _dom = yoyo.update(_dom, node(state, prev, actions));
        }
    };
}
exports.renderer = renderer;
