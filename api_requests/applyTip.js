import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl, productionBaseUrl } from './baseUrl';
import base64 from 'react-native-base64'

export async function applyTip(data){
    //FOR Testing EMV NEEDS PRODUCTION URL
    let headers = await getRequestHeader();
   let url = sandboxBaseUrl;
  // let url = productionBaseUrl;
    url += `payment/${data.id}`;
    //rl = `https://api.mxmerchant.com/checkout/v3/payment/${data.id}`;
    //     let headers = {
    //         'Authorization': 'Basic ' + encoded,
    //         'Content-Type': 'application/json; charset=utf-8'
    //     }
        console.log("data in applyTip");
        console.log(data);
    let status = fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data)
    }).then((response) => {
        console.log(response);
        return response.status;
    });

    return status;
}