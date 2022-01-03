'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

var NativeStorage = /** @class */ (function (_super) {
    tslib.__extends(NativeStorage, _super);
    function NativeStorage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeStorage.prototype.initWithSuiteName = function (reference) { return core.cordova(this, "initWithSuiteName", { "platforms": ["iOS"] }, arguments); };
    NativeStorage.prototype.setItem = function (reference, value) { return core.cordova(this, "setItem", {}, arguments); };
    NativeStorage.prototype.getItem = function (reference) { return core.cordova(this, "getItem", {}, arguments); };
    NativeStorage.prototype.keys = function () { return core.cordova(this, "keys", {}, arguments); };
    NativeStorage.prototype.remove = function (reference) { return core.cordova(this, "remove", {}, arguments); };
    NativeStorage.prototype.clear = function () { return core.cordova(this, "clear", {}, arguments); };
    NativeStorage.pluginName = "NativeStorage";
    NativeStorage.plugin = "cordova-plugin-nativestorage";
    NativeStorage.pluginRef = "NativeStorage";
    NativeStorage.repo = "https://github.com/TheCocoaProject/cordova-plugin-nativestorage";
    NativeStorage.platforms = ["Android", "Browser", "iOS", "macOS", "Windows"];
    NativeStorage.decorators = [
        { type: core$1.Injectable }
    ];
    return NativeStorage;
}(core.IonicNativePlugin));

exports.NativeStorage = NativeStorage;
