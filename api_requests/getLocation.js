import { getRequestHeader } from '../helpers/getRequestHeader';
import { productionBaseUrl,sandboxBaseUrl } from './baseUrl';
import base64 from 'react-native-base64';

export async function getLocation(merchantId){
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    // let url = productionBaseUrl;
    // merchantId = "418399799"; //REMOVE LATER
    url += `merchant/${merchantId}`;

    //    let headers = {
    //        'Authorization': 'Basic ' + encoded,
    //        'Content-Type': 'application/json; charset=utf-8'
    //    }

    let data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        return response.json();
    });

    return data;
}