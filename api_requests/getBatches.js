import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl } from './baseUrl';

export async function getBatches(merchantId, startDate, endDate){
    let data;
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    url += `batch?merchantId=${merchantId}&limit=1000&dateType=Custom&startDate=${startDate.toLocaleDateString()}&endDate=${endDate.toLocaleDateString()}`

    data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        return response.json();
    });

    return data;
}