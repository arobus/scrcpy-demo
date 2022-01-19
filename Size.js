"use strict";
var Size = /** @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
        this.w = width;
        this.h = height;
    }
    Size.equals = function (a, b) {
        if (!a && !b) {
            return true;
        }
        return !!a && !!b && a.equals(b);
    };
    Size.copy = function (a) {
        if (!a) {
            return null;
        }
        return new Size(a.width, a.height);
    };
    Size.prototype.length = function () {
        return this.w * this.h;
    };
    Size.prototype.rotate = function () {
        return new Size(this.height, this.width);
    };
    Size.prototype.equals = function (o) {
        if (this === o) {
            return true;
        }
        if (!o) {
            return false;
        }
        return this.width === o.width && this.height === o.height;
    };
    Size.prototype.intersect = function (o) {
        if (!o) {
            return this;
        }
        var minH = Math.min(this.height, o.height);
        var minW = Math.min(this.width, o.width);
        return new Size(minW, minH);
    };
    Size.prototype.getHalfSize = function () {
        return new Size(this.width >>> 1, this.height >>> 1);
    };
    Size.prototype.toString = function () {
        return "Size{width=".concat(this.width, ", height=").concat(this.height, "}");
    };
    Size.prototype.toJSON = function () {
        return {
            width: this.width,
            height: this.height
        };
    };
    return Size;
}());
