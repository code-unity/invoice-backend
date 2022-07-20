const { check } = require("express-validator");
module.exports = function ScheduleStatus_validator() {

    return [
        check("scheduleId")
            .notEmpty().withMessage("Please enter scheduleId").bail(),
        
        check("invoiceId")
            .notEmpty().withMessage("Please enter scheduleId").bail(),
        
        check("invoiceFetchStatus")
            .notEmpty().withMessage("Please enter invoiceFetchStatus").bail(),

        check("pdfPrintStatus")
            .notEmpty().withMessage("Please enter pdfPrintStatus").bail(),

        check("sendMailStatus")
            .notEmpty().withMessage("Please enter endMailStatus").bail(),
    ];
};