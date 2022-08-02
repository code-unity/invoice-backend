//Dependencies Imported :
var mongoose = require("mongoose");

//Client Schema :
var candidateSchema = mongoose.Schema({

    //Object ID : (Unique ID, automatically created by MongoDb)
    _id: mongoose.Schema.Types.ObjectId,

    //Validation for candidate name :
    name: {
        type: String,
        required: [true, "please enter Name"],
    },
    //Validation for Email :
    email: {
        type: String,
        required: false,
        unique: false,
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

    //Validation for Pan No :
    pan_no: {
        type: String,
        unique: [true, "Pancard already exists"],
        required: [true, "Please enter Pan No"],
        validate: [
            {
                validator: function(v) {
                    return  /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(v);
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
        required: false
    },
    role: {
        type: String,
        default:"Candidate",
    },
    isActive:{
        type: Boolean,
        default:true
    },
     //Validation for Basic :
     Basic: {
        type: String,
        required: [true, "please enter Basic Salary"]
    },

    //Validation for DA :
    D_allow: {
        type: String,
        required: [true, "please enter DA"]    },

    //Validation for HR_allow :
    HR_allow: {
        type: String,
        required: [true, "please enter HR allowance"]
    },

    //Validation for Bonus :
    Bonus: {
        type: String,
        required: [true, "Please Enter Bonus"]
    },

    //Validation for conveyance :
    conveyance: {
        type: String,
        required: [true, "Please Enter conveyance"]
    },

    //Validation for others :
    others: {
        type: String,
        required: [true, "Please enter others Allowance"]
    },

    //Validation for total_earnings :
    total_earnings: {
        type: String,
        required: [true, "Please enter total_earnings"]
    },

    //Validation for prof_tax :
    prof_tax: {
        type: String,
        required: [true, "Please enter Prof. Tax"]
    },

    //Validation for p_f_employee :
    p_f_employee: {
        type: String,
        required: [true, "Please enter Employee PF"]
    },

    //Validation for p_f_employer :
    p_f_employer: {
        type: String,
        required: [true, "Please enter Employer PF"]
    },
    

    //Validation for td_S :
    td_S: {
        type: String,
        required: [true, "Please enter TDS"]
    },

    //Validation for other_tax :
    other_tax: {
        type: String,
        required: [true, "Please enter other_tax"]
    },

    
    //Validation for Designation :
    Designation: {
        type: String,
        required: [true, "Please enter Designation"]
    },

    //Validation for Designation :
    type: {
        type: String,
        required: [true, "Please enter Type of employee"]
    },


   
});

module.exports = mongoose.model("Candidate", candidateSchema);