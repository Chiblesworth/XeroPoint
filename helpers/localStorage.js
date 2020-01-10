import AsyncStorage from '@react-native-community/async-storage';
import { showAlert } from './showAlert';

//Helper functions to reduce lines of code for AsyncStorage
//https://stackoverflow.com/questions/49761839/asyncstorage-getitem-returns-a-single-value-and-a-promise

const storageSet = async(key, value) => {
    try{
        await AsyncStorage.setItem(key, value);
        console.log("key " + key + " was set with " + value);
    }
    catch(error){
        showAlert("Error Occured!", error.toString());
    }
}

const storageGet = async(key) => {
    try{
        const result = await AsyncStorage.getItem(key);
        console.log("AsyncStorage helper method: " + key + " " + result);
        return result;
    }
    catch(error){
        showAlert("Error Occured!", error.toString());
    }
}

const removeItem = async(key) => {
    try{
        AsyncStorage.removeItem(key);
        console.log("AsyncStorage helper method removed: " + key);
    }
    catch(error){
        showAlert("Error Occured!", error.toString());
    }
}

export {storageSet, storageGet, removeItem};