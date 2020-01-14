import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl, productionBaseUrl } from './baseUrl';
import base64 from 'react-native-base64'

export async function getCustomers(merchantId, searchText){
    let data;
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    // let url = productionBaseUrl;
    //merchantId = "418399799";
    url += `customer?merchantId=${merchantId}&filter=${searchText}`;

    //     let headers = {
    //         'Authorization': 'Basic ' + encoded,
    //         'Content-Type': 'application/json; charset=utf-8'
    //     }

    data = fetch(url, {
        method: "GET",
        headers: headers
    }).then((response) => {
        return response.json();
    });
    
    return data;
}