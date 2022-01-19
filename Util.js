"use strict";
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.filterTrailingZeroes = function (bytes) {
        var b = 0;
        return bytes
            .reverse()
            .filter(function (i) { return b || (b = i); })
            .reverse();
    };
    Util.prettyBytes = function (value) {
        var suffix = 0;
        while (value >= 512) {
            suffix++;
            value /= 1024;
        }
        return "".concat(value.toFixed(suffix ? 1 : 0)).concat(Util.SUFFIX[suffix]);
    };
    Util.escapeUdid = function (udid) {
        return 'udid_' + udid.replace(/[. :]/g, '_');
    };
    Util.parseBooleanEnv = function (input) {
        if (typeof input === 'boolean') {
            return input;
        }
        if (typeof input === 'undefined') {
            return undefined;
        }
        if (Array.isArray(input)) {
            input = input[input.length - 1];
        }
        return input === '1' || input.toLowerCase() === 'true';
    };
    Util.parseStringEnv = function (input) {
        if (typeof input === 'undefined') {
            return '';
        }
        if (Array.isArray(input)) {
            input = input[input.length - 1];
        }
        return input;
    };
    Util.parseIntEnv = function (input) {
        if (typeof input === 'number') {
            return input;
        }
        if (typeof input === 'undefined') {
            return undefined;
        }
        if (Array.isArray(input)) {
            input = input[input.length - 1];
        }
        var int = parseInt(input, 10);
        if (isNaN(int)) {
            return undefined;
        }
        return int;
    };
    /**
     * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
     * @param {Uint8Array|Array<number>} bytes UTF-8 byte array.
     * @return {string} 16-bit Unicode string.
     */
    Util.utf8ByteArrayToString = function (bytes) {
        // TODO(user): Use native implementations if/when available
        var out = [], pos = 0, c = 0;
        while (pos < bytes.length) {
            var c1 = bytes[pos++];
            if (c1 < 128) {
                out[c++] = String.fromCharCode(c1);
            }
            else if (c1 > 191 && c1 < 224) {
                var c2 = bytes[pos++];
                out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
            }
            else if (c1 > 239 && c1 < 365) {
                // Surrogate Pair
                var c2 = bytes[pos++];
                var c3 = bytes[pos++];
                var c4 = bytes[pos++];
                var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) -
                    0x10000;
                out[c++] = String.fromCharCode(0xD800 + (u >> 10));
                out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
            }
            else {
                var c2 = bytes[pos++];
                var c3 = bytes[pos++];
                out[c++] =
                    String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
            }
        }
        return out.join('');
    };
    ;
    /* tslint:enable */
    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    Util.supportsPassive = function () {
        if (typeof Util.supportsPassiveValue === 'boolean') {
            return Util.supportsPassiveValue;
        }
        // Test via a getter in the options object to see if the passive property is accessed
        var supportsPassive = false;
        try {
            var opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true;
                }
            });
            // @ts-ignore
            window.addEventListener('testPassive', null, opts);
            // @ts-ignore
            window.removeEventListener('testPassive', null, opts);
        }
        catch (e) { }
        return Util.supportsPassiveValue = supportsPassive;
        // Use our detect's results. passive applied if supported, capture will be false either way.
        // elem.addEventListener('touchstart', fn, supportsPassive ? { passive: true } : false);
    };
    Util.SUFFIX = {
        0: 'B',
        1: 'KiB',
        2: 'MiB',
        3: 'GiB',
        4: 'TiB'
    };
    // https://github.com/google/closure-library/blob/51e5a5ac373aefa354a991816ec418d730e29a7e/closure/goog/crypt/crypt.js#L117
    /*
        Copyright 2008 The Closure Library Authors. All Rights Reserved.
        Licensed under the Apache License, Version 2.0 (the "License");
        you may not use this file except in compliance with the License.
        You may obtain a copy of the License at
    
             http://www.apache.org/licenses/LICENSE-2.0
    
        Unless required by applicable law or agreed to in writing, software
        distributed under the License is distributed on an "AS-IS" BASIS,
        WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
        See the License for the specific language governing permissions and
        limitations under the License.
     */
    /* tslint:disable */
    /**
     * Converts a JS string to a UTF-8 "byte" array.
     * @param {string} str 16-bit unicode string.
     * @return {!Array<number>} UTF-8 byte array.
     */
    Util.stringToUtf8ByteArray = function (str) {
        // TODO(user): Use native implementations if/when available
        var out = [], p = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c < 128) {
                out[p++] = c;
            }
            else if (c < 2048) {
                out[p++] = (c >> 6) | 192;
                out[p++] = (c & 63) | 128;
            }
            else if (((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
                ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
                // Surrogate Pair
                c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
                out[p++] = (c >> 18) | 240;
                out[p++] = ((c >> 12) & 63) | 128;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
            else {
                out[p++] = (c >> 12) | 224;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
        }
        return Uint8Array.from(out);
    };
    return Util;
}());
