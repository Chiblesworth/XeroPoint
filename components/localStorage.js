import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

//Helper functions to reduce lines of code for AsyncStorage
//https://stackoverflow.com/questions/49761839/asyncstorage-getitem-returns-a-single-value-and-a-promise

const storageSet = async(key, value) => {
    try{
        await AsyncStorage.setItem(key, value);
    }
    catch(error){
        console.log(error);
    }
}

const storageGet = async(key) => {
    try{
        const result = await AsyncStorage.getItem(key);
        console.log("AsyncStorage helper method: " + key + " " + result);
        return result;
    }
    catch(error){
        console.log(error);
    }
}

export {storageSet, storageGet};