//Dependencies Imported :
const { check } = require("express-validator");


//Express Validations for client :
module.exports = function schedule_validator() {

    return [

        //Validation for client :
        check("client")
            .notEmpty().withMessage("Please enter client name").bail(),

        //Validation for invoice number :
        check("invoiceNumber")
            .notEmpty().withMessage("Please enter invoice number").bail(),

        //Validation for date :
        check("date")
            .notEmpty().withMessage("Please enter date").bail(),
            //Validation for frequency :
        check("frequency")
        .notEmpty().withMessage("Please enter frequency").bail(),
        //Validation for time :
        check("time")
            .notEmpty().withMessage("Please enter time").bail(),
    ];
};