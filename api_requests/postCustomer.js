import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl } from './baseUrl';

export async function postCustomer(data){
    let createdCustomer;
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
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