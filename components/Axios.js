import axios from 'axios';

/*
    This will be used for the API calls except for possibly the 
    login screen since it looks like it uses a slightly different URL
*/
const Axios = axios.create({
    baseURL: 'https://api.mxmerchant.com/checkout/v3/payment'
});