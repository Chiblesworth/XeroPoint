import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl } from './baseUrl';

export async function getBatchPayments(batchId) {
    let data;
    let headers = await getRequestHeader();
    let url = productionBaseUrl;
    url += `batchpayment?id=${batchId}`;

    data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        return response.json();
    });

    return data;
}