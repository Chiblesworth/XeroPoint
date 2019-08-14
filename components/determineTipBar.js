/*
    This function is used to determine if the user has chosen to use their
    custom tip percentages or the default tips
*/
import AsyncStorage from '@react-native-community/async-storage';

export const determineTipBar = () => {
    AsyncStorage.getItem("useCustomTips").then((useCustomTips) => {
        console.log("use custom in determine is " + useCustomTips);
        return useCustomTips;
    })
}


