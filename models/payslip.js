//Dependencies Imported :
var mongoose = require("mongoose");


//Models Imported :
var Candidate = require("../models/candidate");


//Payroll Schema :
var payrollSchema = mongoose.Schema({

    //Object ID : (Unique ID, automatically created by MongoDb)
    _id: mongoose.Schema.Types.ObjectId,

    //Validation for candidate :

    candidate: {
        type: String,
        required: [true, "Please enter candidate"]
    },

    //Validation for candidate_id :

    candidate_id: {
        type: String,
        required: [true, "Please enter candidate_id"]
    },

    //Validation for Date :
    date:{
        type: String,
        required: [true, "Please enter Date"]
    },

    //Validation for Designation :
    Designation: {
        type: String,
        required: [true, "Please enter Designation"]
    },

    //Validation for assigned :
    assigned: {
        type: String,
        required: [true, "Please enter assigned to"]
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

    //Validation for p_f_employer :
    p_f_employer: {
        type: String,
        required: [true, "Please enter Employer PF"]
    },

    //Validation for p_f_employee :
    p_f_employee: {
        type: String,
        required: [true, "Please enter Employee PF"]
    },
    
    //Validation for total_tax :
    total_tax: {
        type: String,
        required: [true, "Please enter total tax"]
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
    //Validation for net_deductions :
    net_deductions: {
        type: String,
        required: [true, "Please enter net deductions"]
    },
    //Validation for net_salary :
    net_salary: {
        type: String,
        required: [true, "Please enter net Salary"]
    },

    //Validation for remarks :
    remarks: {
        type: String,
        required: [true, "Please enter remarks"]
    },


    isActive:{
        type: Boolean,
        required: [true, "Please enter Active Status"]
    },
});



module.exports = mongoose.model("Payslip", payrollSchema);