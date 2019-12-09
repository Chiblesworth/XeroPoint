import { storageGet } from './localStorage';

export async function getRequestHeader(){
    let encodedUser = await storageGet("encodedUser");
    let headers = {
        'Authorization': 'Basic ' + encodedUser,
        'Content-Type': 'application/json; charset=utf-8'
    }
    return headers;
}