//Dependencies Imported :
var mongoose = require("mongoose");



//schedule Schema :
var scheduleSchema = mongoose.Schema({

    //Object ID : (Unique ID, automatically created by MongoDb)
    _id: mongoose.Schema.Types.ObjectId,

    //Validation for client :
    client: {
        type: String,
        required: [true, "please enter client name"]
    },

    //Validation for invoice number:
    invoiceNumber: {
        type: String,
        required: [true, "please enter invoice number"]
    },

    //Validation for date  :
    date: {
        type: String,
        required: [true, "please Enter date of schedule"]
    },

    //Validation for frequency :
    frequency: {
        type: String,
        required: [true, "please enter frequency"]
    },

    //Validation for time :
    time: {
        type: String,
        required: [true, "please enter time"]
    },
    isActive: {
        type: Boolean,
        default: true
    }
});



module.exports = mongoose.model("Schedule", scheduleSchema);