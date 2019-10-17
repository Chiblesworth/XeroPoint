export const stringToBoolean = (string) => {
    let boolean; 
    console.log("In stringtobool")
    console.log(string)
    if(string == "true" || "True"){
        boolean = true;
    }
    else if(string == "false" || "False"){
        boolean = false;
    }
    else{
        boolean = false; //test
    }
    console.log(boolean)

    return boolean;
}