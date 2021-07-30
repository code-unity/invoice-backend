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

    //Validation for address :
    bill_to: {
        type: String,
        required: [true, "please enter bill to"]
    },

    //Validation for shipping address :
    ship_to: {
        type: String,
        required: [true, "please enter ship to"]
    },

    //Validation for payment terms :
    payment_terms: {
        type: String,
        required: [true, "please enter payment terms"]
    },

    //Validation for date :
    date: {
        type: Date,
        required: [true, "Please Enter Date with format yyyy-mm-dd"]
    },

    //Validation for due date :
    due_date: {
        type: Date,
        required: [true, "Please Enter Due Date with format yyyy-mm-dd"]
    },

    //Validation for items :
    items: [
        {
            //Not creating id :
            _id: false,

            //Validation for item :
            item: {
                type: String,
                required: [true, "Please enter item"]
            },

            //Validation for quantity :
            quantity: {
                type: Number,
                required: [true, "Please enter quantity"]
            },

            //Validation for rate :
            rate: {
                type: Number,
                required: [true, "Please enter rate"]
            },

            //Validation for rate :
            amount: {
                type: Number,
                required: [true, "Please enter amount"]
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

    //Validation for discount :
    discount: {
        type: Number,
        required: [true, "Please enter discount"]
    },

    //Validation for Amount Paid :
    amount_paid: {
        type: Number,
        required: [true, "Please enter amount paid"]
    },

    //Validation for Balance Due :
    balance_due: {
        type: Number,
        required: [true, "Please enter balance due"]
    },

    //Validation for notes :
    notes: {
        type: String,
        required: false
    },

    //Validation for terms :
    terms: {
        type: String,
        required: false
    },
});



module.exports = mongoose.model("Invoice", invoiceSchema);