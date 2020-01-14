import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl, productionBaseUrl } from './baseUrl';

export async function postCustomer(data){
    let createdCustomer;
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    // let url = productionBaseUrl;
    url += `customer?echo=true`;

    createdCustomer = fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json();
    });

    return createdCustomer;
}