import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl } from './baseUrl';

export async function getMerchants(){
    let data;
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    url += `merchant/`;

    data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        return response.json();
    });
    
    return data;
}