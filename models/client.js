//Dependencies Imported :
var mongoose = require("mongoose");



//Client Schema :
var clientSchema = mongoose.Schema({

    //Object ID : (Unique ID, automatically created by MongoDb)
    _id: mongoose.Schema.Types.ObjectId,

    //Validation for client name :
    client_name: {
        type: String,
        unique: [true, "client name already exists"],
        required: [true, "please enter client name"]
    },

    //Validation for address :
    billing_address: {
        type: String,
        required: [true, "please enter billing address"]
    },

    //Validation for shipping address :
    shipping_address: {
        type: String,
        required: [true, "please enter shipping address"]
    },

    //Validation for date of contract :
    date_of_contract: {
        type: Date,
        required: [true, "please Enter date of contract with format yyyy-mm-dd"]
    },

    //Validation for payment terms :
    payment_terms: {
        type: String,
        required: [true, "please enter payment terms"]
    },

    //Validation for payment terms :
    notes: {
        type: String,
        required: false
    },

    //Validation for payment terms :
    terms: {
        type: String,
        required: false
    },
});



module.exports = mongoose.model("Client", clientSchema);