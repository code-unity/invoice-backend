//Dependencies Imported :
const { check } = require("express-validator");



//Express Validations for client :
module.exports = function payslip_validator() {

    return [
        //Validation for candidate name :
        check("candidate")
            .notEmpty().withMessage("Please enter candidate").bail(),

        //Validation for change_id :
        check("change_id")
            .notEmpty().withMessage("Please enter candidate id").bail(),

        //Validation for Basic :
        check("Basic")
            .notEmpty().withMessage("Please enter Basic Salary").bail(),

        //Validation for D_allow :
        check("D_allow")
            .notEmpty().withMessage("Please enter DA").bail(),
        
        //Validation for HR_allow :
        check("HR_allow")
            .notEmpty().withMessage("Please enter HR Allowance").bail(),
        //Validation for Bonus :
        check("Bonus")
            .notEmpty().withMessage("Please enter Bonus").bail(),

        //Validation for conveyance :
        check("conveyance")
            .notEmpty().withMessage("Please enter conveyance").bail(),

        //Validation for others :
        check("others")
            .notEmpty().withMessage("Please enter other Allowance").bail(),

        //Validation for total_earnings :
        check("total_earnings")
            .notEmpty().withMessage("Please enter total_earnings").bail(),

        //Validation for prof_tax :
        check("prof_tax")
            .notEmpty().withMessage("Please enter Professional Tax").bail(),

        //Validation for p_f_employee :
        check("p_f_employee")
            .notEmpty().withMessage("Please enter Employee PF").bail(),
        
        //Validation for p_f_employer :
        check("p_f_employer")
        .notEmpty().withMessage("Please enter Employer PF").bail(),

        //Validation for total_tax :
        check("total_tax")
            .notEmpty().withMessage("Please enter Total Tax").bail(),

        //Validation for td_S :
        check("td_S")
        .notEmpty().withMessage("Please enter TDS").bail(),

        //Validation for other_tax :
        check("other_tax")
        .notEmpty().withMessage("Please enter Other Taxes").bail(),

        //Validation for net_deductions :
        check("net_deductions")
        .notEmpty().withMessage("Please enter net Deductions").bail(),

        //Validation for net_salary :
        check("net_salary")
        .notEmpty().withMessage("Please enter Net Salary").bail(),

        //Validation for Date :
        check("date")
        .notEmpty().withMessage("Please enter Date").bail(),

    ];
};