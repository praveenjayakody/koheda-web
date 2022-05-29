import XCache from "../XCache";
import { XStorage as xsto } from "../XStorage";
export class Auth {
    /**
     * Since CI cannot handle JSON object body, we have to encode using x-www-form-urlencoded i.e. using `URLSearchParams` function
     */
    static serverUrl = (window.location.protocol.indexOf("https") > -1 ? "https": "http") + process.env.REACT_APP_API_URL;
    static userInfo; //This can be used to store user details sent over during auth

    static async authenticate (username, password) {
        const cachePath = "user-info";
        try {
            let response = await fetch(this.serverUrl + 'api/auth/login', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: (new URLSearchParams({
                    email: username,
                    password: password,
                    device_name: "loremipsumdevice"
                })).toString()
            });
            let responseJson = await response.json();
            XCache.store(cachePath, responseJson.user);
            this.userInfo = responseJson.user;
            return responseJson;
        } catch (error) {
            console.error(error);
        }
    }
    static async gauthenticate (email, idToken) {
        /**
         * gauthenticate starts flow of backend auth using idToken returned from Google Sign In
         */
        const cachePath = "user-info";
        try {
            let response = await fetch(this.serverUrl + 'api/auth/gauth', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: (new URLSearchParams({
                    email: email,
                    token: idToken
                })).toString()
            });
            let responseJson = await response.json();
            XCache.store(cachePath, responseJson.user);
            this.userInfo = responseJson.user;
            return responseJson;
        } catch (error) {
            console.error(error, "Api.gauthenticate");
        }
    }
    static async xauthenticate (email, idToken, name, type = "fb") {
        /**
         * xauthenticate starts flow of backend auth using idToken returned from third-party
         */
        const cachePath = "user-info";
        try {
            let response = await fetch(this.serverUrl + 'api/auth/xauth', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: (new URLSearchParams({
                    email: email,
                    token: idToken,
                    type: type,
                    name: name
                })).toString()
            });
            let responseJson = await response.json();
            XCache.store(cachePath, responseJson.user);
            this.userInfo = responseJson.user;
            return responseJson;
        } catch (error) {
            console.error(error, "Api.gauthenticate");
        }
    }
    static async verifyToken () {
        const userToken = xsto.get("token");
        const cachePath = "user-info";

        let cache = await XCache.load(cachePath);

        try {
            let response = await fetch(this.serverUrl + 'api/auth/verifyToken', {
                method: 'POST',
                mode: 'cors',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': "Bearer " + userToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            let responseJson = await response.json();
            if (response.status === 200) {
                this.userInfo = responseJson;
                XCache.store(cachePath, responseJson);
            } else {
                return {error: "token_expired"};
            }
            return responseJson;
        } catch (error) {
            console.error(error);
            if (cache == null) {
                //no user-info cache found. best is to sign out user and clear cache
                return {error: "network_fail"};
            } else {
                //if cache found, return that
                this.userInfo = cache; //load cache as userInfo
                return cache;
            }
        }
    }
    static async logOut () {
        const userToken = xsto.get("token");
        try {
            let response = await fetch(this.serverUrl + 'api/auth/logout', {
                method: 'POST',
                mode: 'cors',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': "Bearer " + userToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            let responseJson = await response.json();

            this.userInfo = responseJson.user;
            return responseJson;
        } catch (error) {
            console.error(error);
        }
    }
}