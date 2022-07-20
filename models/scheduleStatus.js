var mongoose = require("mongoose");



var scheduleSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    
    scheduleId: {
        type: String,
        required: [true, "please enter scheduleId"]
    },

    invoiceId: {
        type: String,
        required: [true, "please enter scheduleId"]
    },
    date: {
        type: String,
        required: [true, "please enter scheduleId"]
    },
    invoiceFetchStatus: {
        type: String,
        required: [true, "please enter invoiceFetchStatus"]
    },

    pdfPrintStatus: {
        type: String,
        required: [true, "please enter pdfPrintStatus"]
    },

    sendMailStatus: {
        type: String,
        required: [true, "please Enter sendMailStatus"]
    },
    
    isActive: {
        type: Boolean,
        default: true
    }
});



module.exports = mongoose.model("scheduleStatus", scheduleSchema);