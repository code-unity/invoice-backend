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



//Middleware's Imported :
var SF_Pag = require("../middlewares/search_functionality-Pagination");          //Middleware for Search-Functionality and Pagination



//Models Imported :
var Invoice =  require("../models/invoice");



//Importing Constants :
var constants_function = require("../constants/constants");
var constants = constants_function("invoice");



//Crud Operations :


// GET Request :
router.get("/",SF_Pag(Invoice), async(req, res)=>{

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
router.post("/", async(req, res)=>{

    //Taking Input Body :
    const {client, bill_from, date, due_date, items, sub_total, tax, total, amount_paid, balence_due, notes, terms} = req.body;

    //Template Path : 
    var template_path =  __dirname.replace("routes", "templates") + "invoice.html";

    //Reading HTML file :
    var templateHtml = fs.readFileSync(template_path, "utf-8");

    //Assigning values to HTML :
    var template = handlebars.compile(templateHtml);
    var finalHtml = encodeURIComponent(template(invoice_data));

    //Format of our pdf
    var options = {
        format: "A4",
        printBackground: true
    };

    //Launching Browser :
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Launching our HTML page in browser :
    await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
        waitUntil: "networkidle0"
    });

    //Creating PDF with our format :
    const pdf = await page.pdf(options);

    //Closing Browser :
    await browser.close();

    //Saving Json Body to mongodb :
    const invoice =  new Invoice({
        _id: new mongoose.Types.ObjectId(),
        client,
        bill_from,
        date,
        due_date,
        items,
        sub_total,
        tax,
        total,
        amount_paid,
        balence_due,
        notes,
        terms
    });
    const new_invoice = await invoice.save();

    //Response :
    res.status(201).json({
        "status": {
            "success": true,
            "code": 201,
            "message": constants.MODEL_CREATE
        },
        "pdf": pdf,
        "data": new_invoice
    });
});



module.exports = router;