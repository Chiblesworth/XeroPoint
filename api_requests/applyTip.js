import { getRequestHeader } from '../helpers/getRequestHeader';
import { sandboxBaseUrl } from './baseUrl';

export async function applyTip(data){
    let headers = await getRequestHeader();
    let url = sandboxBaseUrl;
    url += `payment/${data.id}`;

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