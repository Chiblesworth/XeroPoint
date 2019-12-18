import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl } from './baseUrl';

export async function getMerchantDetails(merchantId){
    let data;
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    url += `merchant/${merchantId}`;

    data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        console.log(response)
        return response.json();
    });

    return data;
}