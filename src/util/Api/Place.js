import { XStorage as xsto } from "../XStorage";
export class Place {
    static serverUrl = (window.location.protocol.indexOf("https") > -1 ? "https": "http") + process.env.REACT_APP_API_URL;
    
    static async list (filters) {
        const userToken = xsto.get("token");
        try {
            let response = await fetch(this.serverUrl + 'api/place/list', {
                method: 'POST',
                mode: 'cors',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': "Bearer " + userToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: (new URLSearchParams(filters)).toString()
            });
            let responseJson = await response.json();

            return responseJson;
        } catch (error) {
            console.error(error);
        }
    }
}