//Dependencies Imported :
const { check } = require("express-validator");



//Express Validations for client :
module.exports = function client_validator() {

    return [

        //Validation for client name :
        check("client")
            .notEmpty().withMessage("Please enter client id").bail(),

        //Validation for address :
        check("bill_from")
            .notEmpty().withMessage("Please enter bill from").bail(),

        //Validation for address :
        check("bill_to")
            .notEmpty().withMessage("Please enter bill to").bail(),

        //Validation for shipping address :
        check("ship_to")
            .notEmpty().withMessage("Please enter ship to").bail(),

        //Validation for payment terms :
        check("payment_terms")
            .notEmpty().withMessage("Please enter payment terms").bail(),

        //Validation for date of contract :
        check("date")
            .notEmpty().withMessage("Please enter date of contract").bail()
            .isDate().withMessage("Enter date with following format YYYY-MM-DD").bail(),
        
        //Validation for date of contract :
        check("due_date")
            .notEmpty().withMessage("Please enter date of contract").bail()
            .isDate().withMessage("Enter due date with following format YYYY-MM-DD").bail(),

        //Validation for tax :
        check("items.*.item")
            .notEmpty().withMessage("Please enter item in items array").bail(),

        //Validation for tax :
        check("items.*.quantity")
            .notEmpty().withMessage("Please enter quantity in items array").bail(),

        //Validation for tax :
        check("items.*.rate")
            .notEmpty().withMessage("Please enter rate in items array").bail(),

        //Validation for tax :
        check("items.*.amount")
            .notEmpty().withMessage("Please enter amount in items array").bail(),

        //Validation for sub total :
        check("sub_total")
            .notEmpty().withMessage("Please enter sub total").bail(),

        //Validation for tax :
        check("tax")
            .notEmpty().withMessage("Please enter tax").bail(),

        //Validation for payment terms :
        check("total")
            .notEmpty().withMessage("Please enter total").bail(),
    ];
};