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

const convertMilitaryToStandardTime = (time, includeSeconds) => {
    //https://stackoverflow.com/questions/29206453/best-way-to-convert-military-time-to-standard-time-in-javascript
    time = time.split(":");

    let hours = Number(time[0]);
    let minutes = Number(time[1]);
    let seconds = Number(time[2]);

    let standardTime;

    if((hours > 0) && (hours <= 12)){
        standardTime = "" + hours;
    }
    else if(hours > 12){
        standardTime = "" + (hours - 12)
    }
    else if(hours == 0){
        standardTime = "12";
    }

    standardTime += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    
    if(includeSeconds){
        standardTime += (seconds < 10) ? ":0" + seconds : ":" + seconds;
    }

    standardTime += (hours >= 12) ? " P.M." : " A.M.";

    return standardTime;
}

export {
    formatDate,
    formatTime,
    convertMilitaryToStandardTime
}