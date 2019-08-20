import { months } from './monthsArray';

//https://stackoverflow.com/questions/29206453/best-way-to-convert-military-time-to-standard-time-in-javascript

const formatDate = () => {
    let date = new Date();
    let formatedDate = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

    return formatedDate;
}

const formatTime = () => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let formatedTime;

    if((hours > 0) && (hours <= 12)){
        formatedTime= hours;
    } 
    else if(hours > 12){
        formatedTime=   (hours - 12);
    } 
    else if(hours == 0){
        formatedTime= "12";
    }

    formatedTime += (minutes < 10) ? ":0" : ":";
    formatedTime += minutes; //Putting "+ minutes" on line above caused bug with numbers less than 10 "2:0" instead of "2:07"
    formatedTime += (hours >= 12) ? " P.M." : " A.M.";

    return formatedTime;
}

export {
    formatDate,
    formatTime
}