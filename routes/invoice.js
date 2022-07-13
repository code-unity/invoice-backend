/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */


//Dependencies Imported :
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var path = require("path");
var fs = require("fs");
var puppeteer = require("puppeteer");
var handlebars = require("handlebars");
const { validationResult } = require("express-validator");


//Middleware's Imported :
var SF_Pag = require("../middlewares/search_functionality-Pagination");          //Middleware for Search-Functionality and Pagination


//Models Imported :
var Invoice = require("../models/invoice");


//Validations Imported :
var Invoice_Validator = require("../validations/invoice_validations");


//Importing Constants :
var constants_function = require("../constants/constants");
var constants = constants_function("invoice");


//Crud Operations :


// GET Request :
router.get("/", SF_Pag(Invoice), async (req, res) => {

    //Response :
    res.status(200).json({
        "status": {
            "success": true,
            "code": 200,
            "message": constants.SUCCESSFUL
        },
        "data": res.Results
    });
});



//POST Request for pdf generation :
router.post("/", Invoice_Validator(), async (req, res) => {

    //Error Handling for Validations :
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        //Respose for Validation Error :
        console.log(errors.array());
        return res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": errors.array()[0].msg
            }
        });
    }

    //Taking Input Body :
    const { client, invoice_number, bill_from, bill_to, ship_to, payment_terms, date, month, year, due_date, items, sub_total, tax, discount, total, amount_paid, balance_due, notes, terms } = req.body;
    //invoice body : 
    const invoice_data = {
        _id: new mongoose.Types.ObjectId(),
        client,
        invoice_number,
        bill_from,
        bill_to,
        ship_to,
        payment_terms,
        date,
        month,
        year,
        due_date,
        items,
        sub_total,
        tax,
        discount,
        total,
        amount_paid,
        balance_due,
        notes,
        terms
    };

    //Template Path : 
    var template_path = __dirname.replace("routes", "templates") + "/" + "invoice.html";

    //Reading HTML file :
    var templateHtml = fs.readFileSync(template_path, "utf-8");

    //Assigning values to HTML :
    var template = handlebars.compile(templateHtml);
    var finalHtml = encodeURIComponent(template(invoice_data));

    //Format of our pdf :
    var options = {
        format: "A4",
        printBackground: true
    };

    //Launching Browser :
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        headless: true
    });
    const page = await browser.newPage();

    //Launching our HTML page in browser :
    await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
        waitUntil: "networkidle0"
    });

    //Creating PDF with our format :
    const pdf = await page.pdf(options);

    //Converting buffer type to base64 format :
    const base64 = Buffer.from(pdf).toString("base64");

    //Closing Browser :
    await browser.close();

    //Saving Invoice Body to mongodb :
    const invoice = new Invoice(invoice_data);
    const new_invoice = await invoice.save();

    //Response :
    res.status(201).send({
        "status": {
            "success": true,
            "code": 201,
            "message": constants.MODEL_CREATE
        },
        "pdf": base64,
        "data": new_invoice
    });
});



//GET Request for Invoice ID :
router.get("/:invoice_id", async (req, res) => {

    try {

        //Finding invoice by ID :
        const id = req.params.invoice_id;
        const invoice = await Invoice.findOne({ _id: id, isActive: true });

        if (invoice == null) {

            //Response if invoice not found :
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {

            //Response :
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 200,
                    "message": constants.SUCCESSFUL
                },
                "data": invoice
            });
        }

        //Error Catching :
    } catch (err) {
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
        console.log(err);
    }
});

// // /GET Request for Invoice ID :
// router.get("/filterbydate/:newmonth/:newyear", async (req, res) => {
//     function splitstring(newstring) {
//         return date.trim().split(/\s+/)[1]
//     }
//     try {

//         //Finding invoice by ID :
//         const mnth = req.params.newmonth;
//         const yr = req.params.newyear;
//         const invoice = await Invoice.find({ splitstring(date): mnth , date: yr, isActive: true });

//         if (invoice == null) {

//             //Response if invoice not found :
//             res.status(404).json({
//                 "status": {
//                     "success": false,
//                     "code": 404,
//                     "message": constants.MODEL_NOT_FOUND
//                 }
//             });
//         } else {

//             //Response :
//             res.status(200).json({
//                 "status": {
//                     "success": true,
//                     "code": 200,
//                     "message": constants.SUCCESSFUL
//                 },
//                 "data": invoice
//             });
//         }

//         //Error Catching :
//     } catch (err) {
//         res.status(500).json({
//             "status": {
//                 "success": false,
//                 "code": 500,
//                 "message": err.message
//             }
//         });
//         console.log(err);
//     }
// });


//DELETE Request for invoice ID :
router.delete("/:invoice_id", async (req, res) => {

    try {

        //Finding invoice :
        const id = req.params.invoice_id;
        const invoice = await Invoice.findById(id);
        if (invoice == null) {
            //Response if invoice not found :
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {

            //Deleting invoice :
            await Invoice.findByIdAndUpdate(id, { isActive: false });
            //Response :
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 204,
                    "message": constants.MODEL_DELETE
                }
            });
        }

        //Error Catching :
    } catch (err) {
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
        console.log(err);
    }
});



module.exports = router; 