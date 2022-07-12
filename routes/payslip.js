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
var Payslip =  require("../models/payslip");


//Validations Imported :
var Payslip_Validator = require("../validations/payslip_validations");


//Importing Constants :
var constants_function = require("../constants/constants");
var constants = constants_function("payslip");


//Crud Operations :


// GET Request :
router.get("/",SF_Pag(Payslip), async(req, res)=>{

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
router.post("/", Payslip_Validator(), async(req, res)=>{

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
    const {    
    candidate,
    candidate_id,
    date,
    Designation,
    assigned,
    Basic,
    D_allow,
    HR_allow,
    Bonus,
    conveyance,
    others,
    total_earnings,
    prof_tax,
    p_f_employer,
    p_f_employee,
    total_tax,
    td_S,other_tax,
    net_deductions,
    net_salary,
    remarks,isActive} = req.body;

    //payslip body : 
    const payslip_data = {
        _id: new mongoose.Types.ObjectId(),
        candidate,
        candidate_id,
        date,
        Designation,
        assigned,
        Basic,
        D_allow,
        HR_allow,
        Bonus,
        conveyance,
        others,
        total_earnings,
        prof_tax,
        p_f_employer,
        p_f_employee,
        total_tax,
        td_S,other_tax,
        net_deductions,
        net_salary,
        remarks,
        isActive
    };

    //Template Path : 
    var template_path =  __dirname.replace("routes", "templates") + "/" + "payslip.html";

    //Reading HTML file :
    var templateHtml = fs.readFileSync(template_path, "utf-8");

    //Assigning values to HTML :
    var template = handlebars.compile(templateHtml);
    var finalHtml = encodeURIComponent(template(payslip_data));

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

    //Saving payslip Body to mongodb :
    const payslip =  new Payslip(payslip_data);
    const new_payslip = await payslip.save();

    //Response :
    res.status(201).send({
        "status": {
            "success": true,
            "code": 201,
            "message": constants.MODEL_CREATE
        },
        "pdf": base64,
        "data": new_payslip
    });
});



//GET Request for payslip ID :
router.get("/:payslip_id", async(req, res)=>{
    
    try{

        //Finding payslip by ID :
        const id = req.params.payslip_id;
        const payslip = await Payslip.findOne({_id:id,isActive:true});

        if (payslip ==  null) {

            //Response if payslip not found :
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
                "data": payslip
            });
        }

    //Error Catching :
    }catch(err){
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



//DELETE Request for payslip ID :
router.delete("/:payslip_id", async(req, res)=>{
    
    try{

        //Finding paysliip :
        const id = req.params.payslip_id;
        const payslip = await Payslip.findById(id);
        if (payslip ==  null) {
            //Response if payslip not found :
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {

            //Deleting payslip :
           await Payslip.findByIdAndUpdate(id, { isActive: false });
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
    }catch(err){
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

//PATCH Request for client ID :
router.patch("/:payslip_id", Payslip_Validator(), async (req, res) => {

    //Error Handling for Validations :
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        //Respose for Validation Error :
        return res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": errors.array()[0].msg
                
            }
        });
    }

    try {

        //Finding client by ID :
        const id = req.params.payslip_id;
        const payslip = await payslip.findOne({ _id: id, isActive: true });

        if (payslip == null) {

            //Response if client not found :
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            
            });
        } else {

            const { candidate,date, assigned, others,other_tax, remarks,Designation,Basic,D_allow,HR_allow,Bonus,
                conveyance,total_earnings,prof_tax,p_f_employer,p_f_employee,total_tax,td_S,net_deductions,net_salary,} = req.body;

            //Updating client :
            payslip.candidate = candidate;
            payslip.assigned = assigned;
            payslip.Bonus = Bonus;
            payslip.others = others;
            payslip.other_tax = other_tax;
            payslip.remarks = remarks;
            payslip.date=date;
            payslip.Designation=Designation;
            payslip.Basic = Basic;
            payslip.D_allow = D_allow;
            payslip.HR_allow = HR_allow;
            payslip.Bonus = Bonus;
            payslip.conveyance=conveyance;
            payslip.total_earnings=total_earnings;
            payslip.prof_tax=prof_tax;
            payslip.p_f_employee=p_f_employee;
            payslip.p_f_employer=p_f_employer;
            payslip.total_tax=total_tax;
            payslip.td_S=td_S;
            payslip.net_deductions=net_deductions;
            payslip.net_salary=net_salary;
            const new_payslip = await payslip.save();

            //Response :
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 204,
                    "message": constants.MODEL_UPDATED
                },
                "data": new_payslip
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