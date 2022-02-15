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
        no_of_hours: parseInt(requests[i].noOfHours),
        attendance: requests[i].attendance,
        date: requests[i].selectedDate,
      };
      const data = new timesheet(datas);
      const newTimeSheet = await data.save();
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

module.exports = router;
