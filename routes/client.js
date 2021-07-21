//Dependencies Imported :
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { validationResult } = require("express-validator");


//Models Imported :
var Client = require("../models/client");


//Middleware's Imported :
var SF_Pag = require("../middlewares/search_functionality-Pagination");          //Middleware for Search-Functionality and Pagination


//Validations Imported :
var Client_Validator = require("../validations/client_validations");


// imported check authorizations :
//var Admin_Authorization = require("../check_authorization/admin_authorization");


//Importing Constants :
var constants_function = require("../constants/constants");
var constants = constants_function("client");


//Crud Operations :

const query = ["client_name", "date_of_contract"];
// GET Request :
router.get("/",SF_Pag(Client, query), async(req, res)=>{

    //Response :
    res.status(200).json({
        "status": {
            "success": true,
            "code": 200,
            "message": constants.SUCCESSFUL
        },
        "data": res.Results
    });
});



//Post Request :
router.post("/", Client_Validator(), async(req, res)=>{

    //Error Handling for Validations :
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        //Respose for Validation Error :
        console.log(errors.array());
        return res.status(422).json({
            "status": {
                "success": false,
                "code": 422,
                "message": errors.array()[0].msg
            }
        });
    }

    try{

        const {client_name, billing_address, shipping_address, date_of_contract, payment_terms, notes, terms} = req.body;

        //Creating new client :
        const client = new Client({
            _id: new mongoose.Types.ObjectId(),
            client_name,
            billing_address,
            shipping_address,
            date_of_contract,
            payment_terms,
            notes,
            terms
        });
        const new_client = await client.save();

        //Response :
        res.status(201).json({
            "status": {
                "success": true,
                "code": 201,
                "message": constants.MODEL_CREATE
            },
            "data": new_client
        });

    //Error Catching :
    }catch(err){
        res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": err.message
            }
        });
        console.log(err);
    }
});



//GET Request for client ID :
router.get("/:client_id", async(req, res)=>{
    
    try{

        //Finding client by ID :
        const id = req.params.client_id;
        const client = await Client.findById(id);

        if (client ==  null) {

            //Response if client not found :
            res.status(400).json({
                "status": {
                    "success": false,
                    "code": 400,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {

            //Response :
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 200,
                    "message": constants.SUCCESSFUL
                },
                "data": client
            });
        }

    //Error Catching :
    }catch(err){
        res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": err.message
            }
        });
        console.log(err);
    }
});



//PATCH Request for client ID :
router.patch("/:client_id", Client_Validator(), async(req, res)=>{

    //Error Handling for Validations :
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        //Respose for Validation Error :
        console.log(errors.array());
        return res.status(422).json({
            "status": {
                "success": false,
                "code": 422,
                "message": errors.array()[0].msg
            }
        });
    }
    
    try{

        //Finding client by ID :
        const id = req.params.client_id;
        const client = await Client.findById(id);

        if (client ==  null) {

            //Response if client not found :
            res.status(400).json({
                "status": {
                    "success": false,
                    "code": 400,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {

            const {client_name, billing_address, shipping_address, date_of_contract, payment_terms, notes, terms} = req.body;

            //Updating client :
            client.client_name = client_name;
            client.billing_address = billing_address;
            client.shipping_address = shipping_address;
            client.date_of_contract = date_of_contract;
            client.payment_terms = payment_terms;
            client.notes = notes;
            client.terms = terms;
            const new_client = await client.save();

            //Response :
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 200,
                    "message": constants.MODEL_UPDATED
                },
                "data": new_client
            });
        }

    //Error Catching :
    }catch(err){
        res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": err.message
            }
        });
        console.log(err);
    }
});

//DELETE Request for client ID :
router.delete("/:client_id", async(req, res)=>{
    
    try{

        //Finding client :
        const id = req.params.client_id;
        const client = await Client.findById(id);

        if (client ==  null) {

            //Response if client not found :
            res.status(400).json({
                "status": {
                    "success": false,
                    "code": 400,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {

            //Deleting client :
            await Client.deleteOne({_id: id});

            //Response :
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 200,
                    "message": constants.MODEL_DELETE
                }
            });
        }

    //Error Catching :
    }catch(err){
        res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": err.message
            }
        });
        console.log(err);
    }
});



module.exports = router;