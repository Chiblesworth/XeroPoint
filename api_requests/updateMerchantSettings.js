import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl } from './baseUrl';

export async function updateMerhcantSettings(merchantId, data){
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    url += `merchantsetting/${merchantId}`;

    let status = fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data)
    }).then((response) => {
        return response.status;
    });

    return status;
}