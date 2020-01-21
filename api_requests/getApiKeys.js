import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl } from './baseUrl';

export async function getApiKeys(merchantId) {
    let headers = await getRequestHeader();
    let url = productionBaseUrl;
    url += `application?merchantId=${merchantId}`;

    let data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        return response.json();
    });

    return data;
}