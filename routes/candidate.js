var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Candidate = require("../models/candidate");
var constants_function = require("../constants/constants");
var constants = constants_function("candidate");
var { validationResult } = require("express-validator");
var Candidate_Validator = require("../validations/candidate_validations");



router.get("/", async (req, res) => {
    try {
        const candidate = await Candidate.find({ isActive: true });
        if (candidate && candidate.length === 0) {
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODELS_NOT_FOUND
                }
            });
        } else {
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 200,
                    "message": constants.SUCCESSFUL
                },
                "data": candidate
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
    }
});
router.post('/', Candidate_Validator(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": errors.array()[0].msg
            }
        });
    }
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
        console.log(err)
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
    }

})
router.put("/:candidate_id", Candidate_Validator(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": errors.array()[0].msg
            }
        });
    }
    try {
        const id = req.params.candidate_id;
            const candidate = await Candidate.findByIdAndUpdate(id, req.body);
            if (!candidate) {
                res.status(404).json({
                    "status": {
                        "success": false,
                        "code": 404,
                        "message": constants.MODEL_NOT_FOUND
                    }
                });
            } else {
                res.status(200).json({
                    "status": {
                        "success": true,
                        "code": 204,
                        "message": constants.MODEL_UPDATED
                    }
                });
            }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
    }
});

router.get("/:candidate_id", async (req, res) => {
    try {
        const id = req.params.candidate_id;
        const candidate = await Candidate.findById(id);
        if (!candidate) {
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 200,
                    "message": constants.SUCCESSFUL
                },
                "data": candidate
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
    }
});

router.delete("/:candidate_id", async (req, res) => {
    try {
        const id = req.params.candidate_id;
        if (id) {
            const candidate = await Candidate.findByIdAndUpdate(id, { isActive: false });

            if (!candidate) {
                res.status(404).json({
                    "status": {
                        "success": false,
                        "code": 404,
                        "message": constants.MODEL_NOT_FOUND
                    }
                });
            } else {
                res.status(200).json({
                    "status": {
                        "success": true,
                        "code": 204,
                        "message": constants.MODEL_DELETE
                    }
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
    }
});



module.exports = router;