import { storageGet, storageSet} from './localStorage';

const checkDefaultStorageValues = async() => {
    let collectServiceFee = await storageGet("collectServiceFee");
    let collectTaxFee = await storageGet("collectTaxFee");
    let serviceFee = await storageGet("serviceFee");
    let taxFee = await storageGet("taxFee");
    let collectTips = await storageGet("collectTips");
    let selectedDefaultTip = await storageGet("selectedDefaultTip");
    let useCustomTips = await storageGet("useCustomTips");
    let customTips = await storageGet("customTips");

    if(collectServiceFee === null){
        storageSet("collectServiceFee", "false");
    }
    if(collectTaxFee === null){
        storageSet("collectTaxFee", "false");
    }
    if(collectTips === null){
        storageSet("collectTips", "true");
    }
    if(useCustomTips === null){
        storageSet("useCustomTips", "false");
    }
    if(collectServiceFee === null){
        storageSet("collectServiceFee", "false");
    }
    if(taxFee === null){
        storageSet("taxFee", "10");
    }
    if(serviceFee === null){
        storageSet("serviceFee", "5");
    }
    if(selectedDefaultTip === null){
        storageSet("selectedDefaultTip", "0");
    }
    if(customTips === null){
        storageSet("customTips", '["15%","20%","25%"]');
    }
}

export {checkDefaultStorageValues};