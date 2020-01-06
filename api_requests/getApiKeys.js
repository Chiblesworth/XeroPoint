import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl } from './baseUrl';

export async function getApiKeys(merchantId) {
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    url += `application?merchantId=${merchantId}`;

    let data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        return response.json();
    });

    return data;
}