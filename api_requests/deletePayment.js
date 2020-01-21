import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl } from './baseUrl';

export async function deletePayment(paymentId){
    let headers = await getRequestHeader();
    let url = productionBaseUrl;
    url += `payment/${paymentId}?force=true`;

    let status = fetch(url, {
        method: "DELETE",
        headers: headers,
    }).then((response) => {
        return response.status;
    });

    return status;
}