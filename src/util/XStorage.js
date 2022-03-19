/*
	ReactJS Storage wrapper for $XUI
	Version:1.0.0
	Author:Praveen K.J.
	Description:
         + Wraps the basic localStorage API to allow the use of settings method
    Usage: import {XStorage as xsto} from '.../XStorage.js'; xsto.get();
*/
/*
    LOG.md
    ----------------------
    ## 02May20
    * Creation

    ## 17Mar22
    * Bug fix in _parseValue()
    * Modified storage prefix so that it is loaded from .env file
    * Added storage clear option
    
*/
export class XStorage {
    static _parseValue (val, returnNull = false) {
        /**
         * If `returnNull` is set to true, null value would return as null instead of false
         */
        if (val === null && returnNull) return val;
        if (val === "true") return true;
        if (typeof val === "undefined" || val === null || val === "false") return false;
        return val;
    }
    static load(key, prefix = process.env.REACT_APP_STORAGE_PREFIX) {
        /**
         * Difference between load and get is that load returns null if the key was not found
         */
        return this._parseValue(localStorage.getItem((prefix !== "" ? prefix+".":"") + key), true);
    }
    static get(key, prefix = process.env.REACT_APP_STORAGE_PREFIX) {
        /**
         * If a prefix is provided, system assumes the key is stored with the prefix preceding the key
         */
        return this._parseValue(localStorage.getItem((prefix !== "" ? prefix+".":"") + key));
    }
    static set(key, value, prefix = process.env.REACT_APP_STORAGE_PREFIX) {
        localStorage.setItem((prefix !== "" ? prefix+".":"") + key, value);
    }
    static clear() {
        /**
         * TODO: Modify this to delete only entries from this app's prefix
         */
        localStorage.clear();
    }

}