module.exports = function constants(model){

    //Constants Json :
    const constants = {
        
        //Request Succesful (Status Code: 200) :
        SUCCESSFUL: "request successful",

        //Request Un-Succesful (Status Code: 400) :
        UN_SUCCESSFUL: "request un-successful",

        //Post request (Status code: 201) :
        MODEL_CREATE: "request successful, " + model + " created succesfully",

        //Mail exists (Status Code: 409) :
        EMAIL_EXIST: "email already exists",

        //Authorization Failed (Status Code: 401) :
        AUTHORIZATION_FAILED: "authorization failed, enter valid username or password",

        //Not Authorized to perform a request (Status Code: 401) :
        NOT_AUTHORIZED: "you are not authorized to perform this request",

        //Authorization Succesful (Status Code: 200) :
        AUTHORIZATION_SUCCESFUL: "authorization Succesful",
    };

    return constants;
};