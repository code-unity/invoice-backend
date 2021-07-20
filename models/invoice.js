//Dependencies Imported :
var mongoose = require("mongoose");


//Models Imported :
var Client = require("../models/client");


//Invoice Schema :
var invoiceSchema = mongoose.Schema({

    //Object ID : (Unique ID, automatically created by MongoDb)
    _id: mongoose.Schema.Types.ObjectId,

    //Validation for client :
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Client,
        required: [true, "Please enter client id"]
    },

    //Validation for Bill from :
    bill_from: {
        type: String,
        required: [true, "Please enter bill from"]
    },

    //Validation for date :
    date: {
        type: Date,
        required: [true, "Please Enter Expires at Date with format YYYY-MM-DD"]
    },

    //Validation for due date :
    due_date: {
        type: Date,
        required: [true, "Please Enter Expires at Date with format YYYY-MM-DD"]
    },

    //Validation for items :
    items: [
        {
            item: {
                type: String,
                required: [true, "Please enter item"]
            },
            quantity: {
                type: Number,
                required: [true, "Please enter quantity"]
            },
            rate: {
                type: Number,
                required: [true, "Please enter rate"]
            }
        }
    ],

    //Validation for sub total :
    sub_total: {
        type: Number,
        required: [true, "Please enter sub total"]
    },

    //Validation for tax :
    tax: {
        type: Number,
        required: [true, "Please enter tax"]
    },

    //Validation for total :
    total: {
        type: Number,
        required: [true, "Please enter total"]
    },

    //Validation for Amount Paid :
    amount_paid: {
        type: Number,
        required: [true, "Please enter amount paid"]
    },

    //Validation for Balence Due :
    balence_due: {
        type: Number,
        required: [true, "Please enter balence due"]
    },

    //Validation for Balence Due :
    notes: {
        type: String,
        required: false
    },

    //Validation for Balence Due :
    terms: {
        type: String,
        required: false
    },
});



module.exports = mongoose.model("Invoice", invoiceSchema);