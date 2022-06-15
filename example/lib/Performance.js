'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Profiling = _interopDefault(require('@nativescript/core/profiling'));

var NotYetImplemented = "NativeScript DOM's Performance API is not yet fully implemented.";

class Performance {
    static onresourcetimingbufferfull = null;
    static get timeOrigin(){
        throw new Error(NotYetImplemented);
    }
    static get timing(){
        throw new Error(NotYetImplemented);
    }
    static now(){
        return Profiling.time();
    }
    static clearMarks(){
        throw new Error(NotYetImplemented);
    }
    static clearMeasures(){
        throw new Error(NotYetImplemented);
    }
    static clearResourceTimings(){
        throw new Error(NotYetImplemented);
    }
    static getEntries(){
        throw new Error(NotYetImplemented);
    }
    static getEntriesByName(){
        throw new Error(NotYetImplemented);
    }
    static getEntriesByType(){
        throw new Error(NotYetImplemented);
    }
    static mark(){
        throw new Error(NotYetImplemented);
    }
    static measure(){
        throw new Error(NotYetImplemented);
    }
    static get memory(){
        throw new Error(NotYetImplemented);
    }
    static get navigation(){
        throw new Error(NotYetImplemented);
    }
    static setResourceTimingBufferSize(){
        throw new Error(NotYetImplemented);
    }
    static toJSON(){
        throw new Error(NotYetImplemented);
    }
}

module.exports = exports = Performance;
exports.default = exports;
