import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl } from './baseUrl';

export async function deletePayment(paymentId){
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    url += `payment/${paymentId}`;

    let status = fetch(url, {
        method: "DELETE",
        headers: headers,
    }).then((response) => {
        return response.status;
    });

    return status;
}