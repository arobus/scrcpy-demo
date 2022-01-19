
// var Rect_1 = require("Rect");
// var Size_1 = require("Size");
// var Util_1 = require("Util");
var VideoSettings = /** @class */ (function () {
    function VideoSettings(data, bytesLength) {
        if (bytesLength === void 0) { bytesLength = VideoSettings.BASE_BUFFER_LENGTH; }
        this.bytesLength = bytesLength;
        this.crop = null;
        this.bitrate = 0;
        this.bounds = null;
        this.maxFps = 0;
        this.iFrameInterval = 0;
        this.sendFrameMeta = false;
        this.lockedVideoOrientation = -1;
        this.displayId = 0;
        if (data) {
            this.crop = data.crop;
            this.bitrate = data.bitrate;
            this.bounds = data.bounds;
            this.maxFps = data.maxFps;
            this.iFrameInterval = data.iFrameInterval;
            this.sendFrameMeta = data.sendFrameMeta || false;
            this.lockedVideoOrientation = data.lockedVideoOrientation || -1;
            if (typeof data.displayId === 'number' && !isNaN(data.displayId) && data.displayId >= 0) {
                this.displayId = data.displayId;
            }
            if (data.codecOptions) {
                this.codecOptions = data.codecOptions.trim();
            }
            if (data.encoderName) {
                this.encoderName = data.encoderName.trim();
            }
        }
    }
    VideoSettings.fromBuffer = function (buffers) {
        var offset = 0;
        var bitrate = buffers.readInt32BE(offset);
        offset += 4;
        var maxFps = buffers.readInt32BE(offset);
        offset += 4;
        var iFrameInterval = buffers.readInt8(offset);
        offset += 1;
        var width = buffers.readInt16BE(offset);
        offset += 2;
        var height = buffers.readInt16BE(offset);
        offset += 2;
        var left = buffers.readInt16BE(offset);
        offset += 2;
        var top = buffers.readInt16BE(offset);
        offset += 2;
        var right = buffers.readInt16BE(offset);
        offset += 2;
        var bottom = buffers.readInt16BE(offset);
        offset += 2;
        var sendFrameMeta = !!buffers.readInt8(offset);
        offset += 1;
        var lockedVideoOrientation = buffers.readInt8(offset);
        offset += 1;
        var displayId = buffers.readInt32BE(offset);
        offset += 4;
        var bounds = null;
        var crop = null;
        if (width !== 0 && height !== 0) {
            bounds = new Size_1["default"](width, height);
        }
        if (left || top || right || bottom) {
            crop = new Rect_1["default"](left, top, right, bottom);
        }
        var codecOptions;
        var encoderName;
        var codecOptionsLength = buffers.readInt32BE(offset);
        offset += 4;
        if (codecOptionsLength) {
            var codecOptionsBytes = buffers.slice(offset, offset + codecOptionsLength);
            offset += codecOptionsLength;
            codecOptions = Util_1["default"].utf8ByteArrayToString(codecOptionsBytes);
        }
        var encoderNameLength = buffers.readInt32BE(offset);
        offset += 4;
        if (encoderNameLength) {
            var encoderNameBytes = buffers.slice(offset, offset + encoderNameLength);
            offset += encoderNameLength;
            encoderName = Util_1["default"].utf8ByteArrayToString(encoderNameBytes);
        }
        return new VideoSettings({
            crop: crop,
            bitrate: bitrate,
            bounds: bounds,
            maxFps: maxFps,
            iFrameInterval: iFrameInterval,
            lockedVideoOrientation: lockedVideoOrientation,
            displayId: displayId,
            sendFrameMeta: sendFrameMeta,
            codecOptions: codecOptions,
            encoderName: encoderName
        }, offset);
    };
    VideoSettings.copy = function (a) {
        return new VideoSettings({
            bitrate: a.bitrate,
            crop: Rect_1["default"].copy(a.crop),
            bounds: Size_1["default"].copy(a.bounds),
            maxFps: a.maxFps,
            iFrameInterval: a.iFrameInterval,
            lockedVideoOrientation: a.lockedVideoOrientation,
            displayId: a.displayId,
            sendFrameMeta: a.sendFrameMeta,
            codecOptions: a.codecOptions,
            encoderName: a.encoderName
        }, a.bytesLength);
    };
    VideoSettings.prototype.equals = function (o) {
        if (!o) {
            return false;
        }
        return (this.encoderName === o.encoderName &&
            this.codecOptions === o.codecOptions &&
            Rect_1["default"].equals(this.crop, o.crop) &&
            this.lockedVideoOrientation === o.lockedVideoOrientation &&
            this.displayId === o.displayId &&
            Size_1["default"].equals(this.bounds, o.bounds) &&
            this.bitrate === o.bitrate &&
            this.maxFps === o.maxFps &&
            this.iFrameInterval === o.iFrameInterval);
    };
    VideoSettings.prototype.toBuffer = function () {
        var additionalLength = 0;
        var codecOptionsBytes;
        var encoderNameBytes;
        if (this.codecOptions) {
            codecOptionsBytes = Util_1["default"].stringToUtf8ByteArray(this.codecOptions);
            additionalLength += codecOptionsBytes.length;
        }
        if (this.encoderName) {
            encoderNameBytes = Util_1["default"].stringToUtf8ByteArray(this.encoderName);
            additionalLength += encoderNameBytes.length;
        }
        var buffers = new buffer.Buffer(VideoSettings.BASE_BUFFER_LENGTH + additionalLength);
        var _a = this.bounds || {}, _b = _a.width, width = _b === void 0 ? 0 : _b, _c = _a.height, height = _c === void 0 ? 0 : _c;
        var _d = this.crop || {}, _e = _d.left, left = _e === void 0 ? 0 : _e, _f = _d.top, top = _f === void 0 ? 0 : _f, _g = _d.right, right = _g === void 0 ? 0 : _g, _h = _d.bottom, bottom = _h === void 0 ? 0 : _h;
        var offset = 0;
        offset = buffers.writeInt32BE(this.bitrate, offset);
        offset = buffers.writeInt32BE(this.maxFps, offset);
        offset = buffers.writeInt8(this.iFrameInterval, offset);
        offset = buffers.writeInt16BE(width, offset);
        offset = buffers.writeInt16BE(height, offset);
        offset = buffers.writeInt16BE(left, offset);
        offset = buffers.writeInt16BE(top, offset);
        offset = buffers.writeInt16BE(right, offset);
        offset = buffers.writeInt16BE(bottom, offset);
        offset = buffers.writeInt8(this.sendFrameMeta ? 1 : 0, offset);
        offset = buffers.writeInt8(this.lockedVideoOrientation, offset);
        offset = buffers.writeInt32BE(this.displayId, offset);
        if (codecOptionsBytes) {
            offset = buffers.writeInt32BE(codecOptionsBytes.length, offset);
            buffers.fill(codecOptionsBytes, offset);
            offset += codecOptionsBytes.length;
        }
        else {
            offset = buffers.writeInt32BE(0, offset);
        }
        if (encoderNameBytes) {
            offset = buffers.writeInt32BE(encoderNameBytes.length, offset);
            buffers.fill(encoderNameBytes, offset);
            offset += encoderNameBytes.length;
        }
        else {
            buffers.writeInt32BE(0, offset);
        }
        return buffers;
    };
    VideoSettings.prototype.toString = function () {
        // prettier-ignore
        return "VideoSettings{bitrate=".concat(this.bitrate, ", maxFps=").concat(this.maxFps, ", iFrameInterval=").concat(this.iFrameInterval, ", bounds=").concat(this.bounds, ", crop=").concat(this.crop, ", metaFrame=").concat(this.sendFrameMeta, ", lockedVideoOrientation=").concat(this.lockedVideoOrientation, ", displayId=").concat(this.displayId, ", codecOptions=").concat(this.codecOptions, ", encoderName=").concat(this.encoderName, "}");
    };
    VideoSettings.prototype.toJSON = function () {
        return {
            bitrate: this.bitrate,
            maxFps: this.maxFps,
            iFrameInterval: this.iFrameInterval,
            bounds: this.bounds,
            crop: this.crop,
            sendFrameMeta: this.sendFrameMeta,
            lockedVideoOrientation: this.lockedVideoOrientation,
            displayId: this.displayId,
            codecOptions: this.codecOptions,
            encoderName: this.encoderName
        };
    };
    VideoSettings.BASE_BUFFER_LENGTH = 35;
    return VideoSettings;
}());
// exports  ["default"] = VideoSettings;
