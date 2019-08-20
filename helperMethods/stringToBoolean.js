export const stringToBoolean = (string) => {
    let boolean; 

    if(string === "true"){
        boolean = true;
    }
    else if(string === "false"){
        boolean = false;
    }
    else{
        boolean = "Cannot be determined."
    }

    return boolean;
}