"use strict";
var Rect = /** @class */ (function () {
    function Rect(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    Rect.equals = function (a, b) {
        if (!a && !b) {
            return true;
        }
        return !!a && !!b && a.equals(b);
    };
    Rect.copy = function (a) {
        if (!a) {
            return null;
        }
        return new Rect(a.left, a.top, a.right, a.bottom);
    };
    Rect.prototype.equals = function (o) {
        if (this === o) {
            return true;
        }
        if (!o) {
            return false;
        }
        return this.left === o.left && this.top === o.top && this.right === o.right && this.bottom === o.bottom;
    };
    Rect.prototype.getWidth = function () {
        return this.right - this.left;
    };
    Rect.prototype.getHeight = function () {
        return this.bottom - this.top;
    };
    Rect.prototype.toString = function () {
        // prettier-ignore
        return "Rect{left=".concat(this.left, ", top=").concat(this.top, ", right=").concat(this.right, ", bottom=").concat(this.bottom, "}");
    };
    Rect.prototype.toJSON = function () {
        return {
            left: this.left,
            right: this.right,
            top: this.top,
            bottom: this.bottom
        };
    };
    return Rect;
}());
