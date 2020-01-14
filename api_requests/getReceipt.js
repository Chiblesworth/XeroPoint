import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl } from './baseUrl';

export async function getReceipt(paymentId, input){
    let headers = await getRequestHeader();
    let url = productionBaseUrl;
    url += `paymentreceipt?id=${paymentId}&contact=${input}`;

    let status = fetch(url, {
        method: "POST",
        headers: headers,
    }).then((response) => {
        return response.status;
    });

    return status;
}