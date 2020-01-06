import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl } from './baseUrl';
import base64 from 'react-native-base64'


export async function deletePayment(paymentId){
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
   url += `payment/${paymentId}`;

    //url = `https://api.mxmerchant.com/checkout/v3/payment/${paymentId}`;
    //    let headers = {
    //        'Authorization': 'Basic ' + encoded,
   //         'Content-Type': 'application/json; charset=utf-8'
   //     }


    let status = fetch(url, {
        method: "DELETE",
        headers: headers,
    }).then((response) => {
        return response.status;
    });

    return status;
}