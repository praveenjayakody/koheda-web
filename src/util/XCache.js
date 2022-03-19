import { XStorage as xsto } from "./XStorage";

export default class XCache {
    static async load (cachePath) {
        /**
         * Loads the data stored at cache path or returns null if not found
         */
        let strStore = xsto.load(cachePath);
        if (strStore == null) {
            //cache not present
            return null;
        } else {
            return JSON.parse(strStore);
        }
    }
    static store (cachePath, data) {
        /**
         * Stores the data locally
         */
        xsto.set(cachePath, JSON.stringify(data));
    }
}