import { productionBaseUrl } from './baseUrl';

// Header gets passed in since it's login
export async function authenticate(headers) {
    let data;
    let url = productionBaseUrl;
    url += `payment?echo=true`;

    data = fetch(url, {
        headers: headers
    }).then((response) => {
        return response.status;
    });
    
    return data;
}