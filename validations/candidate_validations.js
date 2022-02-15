const { check } = require("express-validator");


module.exports = function candidate_validator() {

    return [
        check("name")
            .notEmpty().withMessage("Please enter name").bail(),

        check("email")
            .notEmpty().withMessage("Please enter email").bail(),

        check("date_of_birth")
            .notEmpty().withMessage("please enter Date of Birth").bail(),

        check("assigned_to")
            .notEmpty().withMessage("please enter assigned to").bail(),

        check("date_of_Joining")
            .notEmpty().withMessage("Please enter Date of Joining").bail(),

        check("payment_terms")
            .notEmpty().withMessage("Please enter payment terms").bail(),
    ];
};