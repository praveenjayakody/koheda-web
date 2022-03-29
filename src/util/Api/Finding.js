import { XStorage as xsto } from "../XStorage";
export class Finding {
    static serverUrl = (window.location.protocol.indexOf("https") > -1 ? "https": "http") + process.env.REACT_APP_API_URL;
    
    static async store (entity) {
        const userToken = xsto.get("token");
        try {
            let response = await fetch(this.serverUrl + 'api/finding', {
                method: 'POST',
                mode: 'cors',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': "Bearer " + userToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: (new URLSearchParams(entity)).toString()
            });
            let responseJson = await response.json();

            return responseJson;
        } catch (error) {
            console.error(error);
        }
    }
}