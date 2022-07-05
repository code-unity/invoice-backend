var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { validationResult } = require("express-validator");


//Models Imported :
var Schedule = require("../models/schedule");


//Middleware's Imported :
var SF_Pag = require("../middlewares/search_functionality-Pagination");          //Middleware for Search-Functionality and Pagination


//Validations Imported :
var Schedule_Validator = require("../validations/schedule_validations");


// imported check authorizations :
//var Admin_Authorization = require("../check_authorization/admin_authorization");


//Importing Constants :
var constants_function = require("../constants/constants");
var constants = constants_function("schedule");


//Crud Operations :

const query = ["date", "invoiceNumber"];
// GET Request :
router.get("/", SF_Pag(Schedule, query), async (req, res) => {

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
router.post("/", Schedule_Validator(), async (req, res) => {

    //Error Handling for Validations :
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        //Respose for Validation Error :
        console.log(errors.array());
        return res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": errors.array()[0].msg
            }
        });
    }

    try {

        const { is_active, client, invoiceNumber, date, frequency, time } = req.body;

        //Creating new schedule :
        const schedule = new Schedule({
            _id: new mongoose.Types.ObjectId(),
            is_active, client, invoiceNumber, date, frequency, time
        });
        const new_schedule = await schedule.save();

        //Response :
        res.status(200).json({
            "status": {
                "success": true,
                "code": 201,
                "message": constants.MODEL_CREATE
            },
            "data": new_schedule
        });

        //Error Catching :
    } catch (err) {
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
        console.log(err);
    }
});



//GET Request for schedule ID :
router.get("/:schedule_id", async (req, res) => {

    try {

        //Finding schedule by ID :
        const id = req.params.schedule_id;
        const schedule = await Schedule.findOne({ _id: id, isActive: true });

        if (schedule == null) {

            //Response if schedule not found :
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
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
                "data": schedule
            });
        }

        //Error Catching :
    } catch (err) {
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
        console.log(err);
    }
});



//PATCH Request for cschedule ID :
router.patch("/:schedule_id", Schedule_Validator(), async (req, res) => {

    //Error Handling for Validations :
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        //Response for Validation Error :
        return res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": errors.array()[0].msg
            }
        });
    }

    try {

        //Finding schedule by ID :
        const id = req.params.schedule_id;
        const schedule = await Schedule.findOne({ _id: id, isActive: true });

        if (schedule == null) {

            //Response if schedule not found :
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {

            const { is_active, client, invoiceNumber, date, frequency, time } = req.body;

            //Updating schedule :
            schedule.is_active = is_active;
            schedule.client = client;
            schedule.invoiceNumber = invoiceNumber;
            schedule.date = date;
            schedule.frequency = frequency;
            schedule.time = time;
            const new_schedule = await schedule.save();

            //Response :
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 204,
                    "message": constants.MODEL_UPDATED
                },
                "data": new_schedule
            });
        }

        //Error Catching :
    } catch (err) {
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
        console.log(err);
    }
});

//DELETE Request for schedule ID :
router.delete("/:schedule_id", async (req, res) => {

    try {

        //Finding schedule :
        const id = req.params.schedule_id;
        const schedule = await Schedule.findById(id);

        if (schedule == null) {

            //Response if schedule not found :
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {

            //Deleting schedule :
            await Schedule.findByIdAndUpdate(id, { isActive: false });

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
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
        console.log(err);
    }
});



module.exports = router;