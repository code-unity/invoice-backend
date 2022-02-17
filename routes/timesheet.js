var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var timesheet = require("../models/timesheet");
var constants_function = require("../constants/constants");
var constants = constants_function("client");
router.post("/", async (req, res) => {
  let requests = req.body;
  try {
    for (let i = 0; i < requests.length; i++) {
      const datas = {
        _id: new mongoose.Types.ObjectId(),
        description: requests[i].description,
        no_of_hours: requests[i].no_of_hours,
        attendance: requests[i].attendance,
        date: requests[i].date,
      };
      const data = new timesheet(datas);
      await data.save();
    }
    res.status(200).json({
      status: {
        success: true,
        code: 200,
        message: constants.SUCCESSFUL,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: {
        success: false,
        code: 400,
        message: err.message,
      },
    });
    console.log("error", err);
  }
});
router.get("/", async (req, res) => {
  try {
    const timeSheet = await timesheet.find({})
    res.status(200).json({
      status: {
        success: true,
        code: 200,
        message: constants.SUCCESSFUL,
        data: timeSheet
      },
    });
  } catch (err) {
    res.status(400).json({
      status: {
        success: false,
        code: 400,
        message: err.message,
      },
    });
    console.log("error", err);
  }
});

router.put("/", async (req, res) => {
  let requests = req.body;
  console.log(requests)
  try {
    for (let i = 0; i < requests.length; i++) {
  await timesheet.findByIdAndUpdate(requests[i]._id,{
    _id: requests[i]._id,
    description: requests[i].description,
    no_of_hours: requests[i].no_of_hours,
    attendance: requests[i].attendance,
    date: requests[i].date,
  });
    }
    res.status(200).json({
      status: {
        success: true,
        code: 204,
        message: constants.SUCCESSFUL,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: {
        success: false,
        code: 400,
        message: err.message,
      },
    });
    console.log("error", err);
  }
});
module.exports = router;
