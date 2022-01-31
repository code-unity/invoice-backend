//Dependencies Imported :
const bcrypt = require("bcrypt");
var mongoose = require("mongoose");


//Models Imported :
var Admin = require("../models/admin");


//Middleware's Imported :
var config = require("../config/config.json");


//Importing Constants :
var constants_function = require("../constants/constants");
var constants = constants_function("admin");


//MongoDb Connection :
mongoose.connect(config.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},function(err, conn){
    if(err){
        console.log("mongodb connection error", err);
    }
    if(!err && conn){
        console.log("mongodb connection stablished");
    }
});


//Admin Credentials to add to mongodb: 
var admin = [
    new Admin({
        _id: new mongoose.Types.ObjectId(),
        username: "admin",
        email :"admin@codeunity.co",
        password: bcrypt.hashSync("Codeunity@1",10).toString(),
        phone_number: "9951207401",
        role: 'admin'
    }),
    new Admin({
        _id: new mongoose.Types.ObjectId(),
        username: "admin",
        email :"yaswanth@codeunity.co",
        password: bcrypt.hashSync("Codeunity@1",10).toString(),
        phone_number: "9030656522",
        role: 'admin'
    }),
    new Admin({
        _id: new mongoose.Types.ObjectId(),
        username: "admin",
        email :"ranjith@codeunity.co",
        password: bcrypt.hashSync("Codeunity@1",10).toString(),
        phone_number: "9840572927",
        role: 'admin'
    }),
];


//Creating new Admin :

var done = 0;
for (var i=0; i<admin.length; i++) {
    admin[i].save(function(err) {
        if (!err)
        {
            console.log({
                "status": {
                    "success": true,
                    "code": 200,
                    "message": constants.MODEL_CREATE
                }
            });
        }
        if(err) {
            console.log({
                "status": {
                    "success": false,
                    "code": 400,
                    "message": constants.UN_SUCCESSFUL
                },
                "error": err
            });
        }
        done++;
        if (done === admin.length) {
            exit();
        }
    });
}


//Disconnecting Mongoose :
function exit() {
    mongoose.disconnect(function(err){
        if(!err){
            console.log("mongo connection disconnected");
        }
        if(err){
            console.log("error in disconnecting mongodb");
        }
    });
}