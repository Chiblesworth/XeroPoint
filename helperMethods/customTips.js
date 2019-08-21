import { storageGet } from './localStorage';

const getCustomTipsArray = async() => {
    let customTips = await storageGet("customTips"); //Expecting an array printed as a string ex "[10%,20%,30%]""
    let customTipArray = ["No Tip"];

    customTips = customTips.replace(/(\[)|(\])|(\")+/g, "");

    let tempArray = customTips.split(",");

    for(let i = 0; i < tempArray.length; i++){
        customTipArray.push(tempArray[i]);
    }

    customTipArray.push("Other");

    return customTipArray;
}

export {
    getCustomTipsArray
}