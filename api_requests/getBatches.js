import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl, sandboxBaseUrl } from './baseUrl';
import base64 from 'react-native-base64';

export async function getBatches(merchantId, startDate, endDate){
    let data;
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    //merchantId = "418399799"; //REMOVE LATER
    url += `batch?merchantId=${merchantId}&limit=1000&dateType=Custom&startDate=${startDate.toLocaleDateString()}&endDate=${endDate.toLocaleDateString()}`

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