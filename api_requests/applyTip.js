import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl } from './baseUrl';

export async function applyTip(data){
    let headers = await getRequestHeader();
    let url = productionBaseUrl;
    url += `payment/${data.id}`;
   
    let status = fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data)
    }).then((response) => {
        return response.status;
    });

    return status;
}