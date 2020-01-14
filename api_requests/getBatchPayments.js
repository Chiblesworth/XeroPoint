import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl, sandboxBaseUrl } from './baseUrl';
import base64 from 'react-native-base64';

export async function getBatchPayments(batchId) {
    let data;
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    // let url = productionBaseUrl;
    url += `batchpayment?id=${batchId}`;

    //    let headers = {
    //        'Authorization': 'Basic ' + encoded,
    //        'Content-Type': 'application/json; charset=utf-8'
    //    }

    data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        return response.json();
    });

    return data;
}