import { XStorage as xsto } from "../XStorage";
export class Auth {
    /**
     * Since CI cannot handle JSON object body, we have to encode using x-www-form-urlencoded i.e. using `URLSearchParams` function
     */
    static serverUrl = (window.location.protocol.indexOf("https") > -1 ? "https": "http") + process.env.REACT_APP_API_URL;
    static userInfo; //This can be used to store user details sent over during auth

    static async authenticate (username, password) {
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

            this.userInfo = responseJson.user;
            return responseJson;
        } catch (error) {
            console.error(error, "Api.gauthenticate");
        }
    }
    static async verifyToken () {
        const userToken = xsto("token");
        try {
            let response = await fetch(this.serverUrl + 'api/auth/verify_token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userToken 
                })
            });
            let responseJson = await response.json();
            this.userInfo = responseJson;
            console.log(this.userInfo);
            return responseJson;
        } catch (error) {
            console.error(error);
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