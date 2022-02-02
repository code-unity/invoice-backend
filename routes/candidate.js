//Dependencies Imported :
var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
const { validationResult } = require("express-validator");

//Middleware's Imported :
var config = require("../config/config.json");
const auth = require('../check_authorization/admin_authorization');

//Models Imported :
var Candidate = require("../models/candidate");

//Importing Constants :
var constants_function = require("../constants/constants");
var constants = constants_function("candidate");


//Crud Operations :

//GET Request for candidates:
router.get("/", async (req, res) => {

    try {
        //Finding candidates:
        const candidate = await Candidate.find({});

        if (candidate.length===0) {

            //Response if candidates not found :
            res.status(400).json({
                "status": {
                    "success": false,
                    "code": 400,
                    "message": constants.MODELS_NOT_FOUND
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
                "data": candidate
            });
        }

        //Error Catching :
    } catch (err) {
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
// POST Request for Candidate:
router.post('/', async (req, res) => {
    try {
        const candidate = new Candidate({ _id: new mongoose.Types.ObjectId(), ...req.body })
        await candidate.save()
        res.status(201).json({
            "status": {
                "success": true,
                "code": 201,
                "message": constants.MODEL_CREATE
            }
        });
    }
    catch (err) {
        res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": err._message
            }
        });
        console.log(err)
    }

})
// PUT Request for Candidate:
router.put("/:candidate_id", async (req, res) => {
    try {
        //Finding candidate by ID :
        const id = req.params.candidate_id;
        const candidate= await Candidate.findByIdAndUpdate(id,req.body);
        if (candidate == null) {
            //Response if candidate not found :
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
                    "code": 204,
                    "message": constants. MODEL_UPDATED
                }
            });
        }

        //Error Catching :
    } catch (err) {
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

//GET Request for candidate ID :
router.get("/:candidate_id", async (req, res) => {

    try {
        //Finding candidate by ID :
        const id = req.params.candidate_id;
        const candidate = await Candidate.findById(id);

        if (candidate == null) {

            //Response if candidate not found :
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
                "data": candidate
            });
        }

        //Error Catching :
    } catch (err) {
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

// Delete Request for candidate:
router.delete("/:candidate_id", async (req, res) => {
    try {

        //Finding candidate :
        const id = req.params.candidate_id;
        const candidate = await Candidate.findById(id);

        if (candidate == null) {

            //Response if candidate not found :
            res.status(400).json({
                "status": {
                    "success": false,
                    "code": 400,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {

            //Deleting candidate :
            await Candidate.deleteOne({ _id: id });

            //Response :
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 204,
                    "message": constants.MODEL_DELETE
                }
            });
        }

        //Error Catching :
    } catch (err) {
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