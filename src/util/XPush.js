/*
	ReactJS push manager
	Version:1.0.0
	Author:Praveen K.J.
	Description:
         + Utility wrapper to easily manage push status and registrations
    Usage: import {XPush as xpush} from '.../XPush.js'; xsto.getSubscription();
*/
/*
    LOG.md
    ----------------------
    ## 14Jun22
    * Creation
    
*/
export class XPush {
    static sw = navigator.serviceWorker.ready;

    static config = {
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_APPLICATION_SERVER_KEY
    };

    static async getStatus() {
        const swReg = await this.sw;

        return await swReg.pushManager.permissionState(this.config);
    }
    
    static async subscribe(cfg) {
        const o = cfg || this.config;
        return (await this.sw).pushManager.subscribe(o);
    }

}