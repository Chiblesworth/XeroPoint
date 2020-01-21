import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl } from './baseUrl';

export async function updateMerhcantSettings(merchantId, data){
    let headers = await getRequestHeader();
    let url = productionBaseUrl;
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