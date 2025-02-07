"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInstall = withInstall;
function withInstall(comp) {
    comp.install = function (app) {
        const { name } = comp;
        app.component(name, comp);
    };
    return comp;
}
