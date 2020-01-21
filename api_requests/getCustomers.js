import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl } from './baseUrl';

export async function getCustomers(merchantId, searchText){
    let data;
    let headers = await getRequestHeader();
    let url = productionBaseUrl;
    url += `customer?merchantId=${merchantId}&filter=${searchText}`;
    
    data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        return response.json();
    });
    
    return data;
}