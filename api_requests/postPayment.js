import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl } from './baseUrl';

export async function postPayment(data){
    let headers = await getRequestHeader();
    let url = productionBaseUrl;
    url += `payment?echo=true`;

    let createdPayment = fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
        dataType: "json"
    }).then((response) => {
        return response.json();
    });

    return createdPayment;
}