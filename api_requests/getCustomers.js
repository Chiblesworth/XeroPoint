import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl } from './baseUrl';

export async function getCustomers(merchantId, searchText){
    let data;
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    url += `customer?merchantId=${merchantId}&filter=${searchText}`;

    data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        return response.json();
    });
    
    return data;
}