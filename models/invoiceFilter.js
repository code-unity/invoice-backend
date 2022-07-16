//Dependencies Imported :
var mongoose = require("mongoose");

var invoiceFilterSchema = mongoose.Schema({
    //Object ID : (Unique ID, automatically created by MongoDb)
    _id: mongoose.Schema.Types.ObjectId,


    //validation for toEmail 
    toEmails:
    {
        type: [],
        required: [true, "please enter a Email Id"]
    },
    //validation for invoices
    invoiceData:
    {
        type: [],
        required: [true, "There are no invoices to send via Email"]
    }
})

module.exports = mongoose.model("invoiceFilter", invoiceFilterSchema);