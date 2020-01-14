import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl, productionBaseUrl } from './baseUrl';

export async function closeBatch(batchId){
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    // let url = productionBaseUrl;
    url += `batch/${batchId}`;

    let status = fetch(url, {
        method: "PUT",
        headers: headers
    }).then((response) => {
        return response.status;
    });

    return status;
}