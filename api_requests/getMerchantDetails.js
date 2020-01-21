import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl } from './baseUrl';

export async function getMerchantDetails(merchantId){
    let data;
    let headers = await getRequestHeader();
    let url = productionBaseUrl;
    url += `merchant/${merchantId}`;

    data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        return response.json();
    });

    return data;
}