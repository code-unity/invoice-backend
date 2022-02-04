//Dependencies Imported :
var mongoose = require("mongoose");

//Client Schema :
var candidateSchema = mongoose.Schema({

    //Object ID : (Unique ID, automatically created by MongoDb)
    _id: mongoose.Schema.Types.ObjectId,

    //Validation for candidate name :
    name: {
        type: String,
        unique: [true, "name already exists"],
        required: [true, "please enter Name"],
        min: [4, "user name should be minimum 4 characters"]

    },
    //Validation for Email :
    email: {
        type: String,
        unique: [true, "email already exists"],
        required: [true, "please enter email address"],
        lowercase: [true, "email address must be lowercase"],
        validate: [
            {
                validator: function(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                Error: "please enter a valid email address"
            }
        ]
    },
    //Validation for Date of Birth :
    date_of_birth: {
        type: String,
        required: [true, "please enter Date of Birth"]
    },
    //Validation for assigned_to:
    assigned_to: {
        type: String,
        required: [true, "please enter assigned to"]
    },
    //Validation for date of Joining :
    date_of_Joining: {
        type: String,
        required: [true, "please enter Date of Joining"]
    },

    //Validation for payment terms :
    payment_terms: {
        type: String,
        required: [true, "please enter payment terms"]
    },
    role: {
        type: String,
        default:"Candidate",
    },
    isActive:{
        type: Boolean,
        default:true
    },
   
});

module.exports = mongoose.model("Candidate", candidateSchema);