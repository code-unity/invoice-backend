/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
 
const nodeCron = require("node-cron");
const invoice = require("./models/invoice");
const schedule = require("./models/schedule");
var nodemailer = require("nodemailer");
var express = require("express");
var fs = require("fs");
var handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const ScheduleStatus = require("./models/scheduleStatus");
var scheduleStatus=[] ;

 
function validateStartDate(date){
    const currDate = new Date();
    date = new Date(date);
    if(date.getFullYear() < currDate.getFullYear() ){
        return true;
    }
    else if (date.getFullYear() === currDate.getFullYear()){
        if(date.getMonth() < currDate.getMonth()){
            return true;
        }
        else if (date.getMonth() === currDate.getMonth()){
            if(date.getDate() <= currDate.getDate()){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}
const filterSchedules = async () =>{
    var filteredSchedules=[];
    var scheduleFilter = await schedule.find({isActive: true});
    scheduleFilter.filter(function(item) {
        if(item.frequency=== "Daily" && item.isDisabled === false && validateStartDate(item.date)){
            scheduleStatus.push({date: new Date().toDateString() ,scheduleId: item._id, invoiceId: "", invoiceFetchStatus: "false",pdfPrintStatus: "false", sendMailStatus: "false"});
            filteredSchedules.push(item);
        }
    });
    scheduleFilter.filter(function(item) {
        if(item.frequency=== "Monthly" && item.isDisabled === false && validateStartDate(item.date) && new Date(item.date).getDate() === new Date().getDate()){
            scheduleStatus.push({date: new Date().toDateString() ,scheduleId: item._id, invoiceId: "",invoiceFetchStatus: "false",pdfPrintStatus: "false", sendMailStatus: "false"});
            filteredSchedules.push(item);
        }
    });
    scheduleFilter.filter(function(item) {
        if(item.frequency=== "Weekly" && item.isDisabled === false && validateStartDate(item.date) && new Date().toDateString().split(" ")[0] === new Date(item.date).toDateString().split(" ")[0]){
            scheduleStatus.push({date: new Date().toDateString() ,scheduleId: item._id, invoiceId: "",invoiceFetchStatus: "false",pdfPrintStatus: "false", sendMailStatus: "false"});
            filteredSchedules.push(item);
        }
    });
    scheduleFilter.filter(function(item) {
        if(item.frequency=== "Anually" && item.isDisabled === false && validateStartDate(item.date) && new Date(item.date).getDate() === new Date().getDate() && new Date(item.date).getMonth() === new Date().getMonth() ){
            scheduleStatus.push({date: new Date().toDateString() ,scheduleId: item._id, invoiceId: "",invoiceFetchStatus: "false",pdfPrintStatus: "false", sendMailStatus: "false"});
            filteredSchedules.push(item);
        }
    });
    return filteredSchedules;
};
 
async function filterInvoices(filteredSchedules) {
    var filteredInvoices = [];
    var invoiceFilter;
    for(let i =0 ; i< filteredSchedules.length ; i++){
        invoiceFilter = await invoice.find({_id : filteredSchedules[i].invoiceNumber});
        try{
            invoiceFilter.filter(function(item) {
                if( item.isActive === true ){
                    const newInvoice = item;
                    newInvoice.date = new Date().toDateString();
                    item=newInvoice;
                    scheduleStatus[i].invoiceFetchStatus="true";
                    scheduleStatus[i].invoiceId=filteredSchedules[i].invoiceNumber;
                    filteredInvoices.push(item);
                }
            });
        }
        catch(err){
            console.log(`Unable to find the invoice details with id ${filteredSchedules[i].invoiceNumber}`);
        }
        
    }
    return filteredInvoices;
}
const sendMail = async(filteredInvoices) => {
    const invoices = [];
    for (var i = 0; i < filteredInvoices.length; i++) {
        invoices.push({
            filename: `${filteredInvoices[i]._id}.pdf`,
            path: __dirname.replace("routes", "Invoices") + "/" + `${filteredInvoices[i]._id}.pdf`,
        });
    }
    console.log("ready to send mails");
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: true,
        auth: {
            user: "codeunity.test@gmail.com",
            pass: "beparojilxrzcwyc"
        }
    });
    var mailOptions = {
        from: "CodeUnity Technologies private Limited",
        to: "satish.chadive@gmail.com",
        subject: "CodeUnity Technologies invoices today",
        text: "Hello Auditor, Please find the attached invoices  below",
        attachments: invoices,
    };try {
        await transporter.sendMail(mailOptions);
        console.log("Email Sent Successfully");
    }
    catch (error) {
        console.log("Email not sent");
        console.log(error);
    }
};
const invoicePdfsGeneration = async (filteredInvoices) => {
    for (var i = 0; i < filteredInvoices.length; i++){
        try{
            await generatePdf(filteredInvoices[i]);
            var findInvoiceById=scheduleStatus.filter(obj => obj.invoiceId == filteredInvoices[i]._id);
            findInvoiceById[0].pdfPrintStatus="true";
            findInvoiceById[0].sendMailStatus="true";
        }
        catch(err){
            console.log(`failed to generate pdf for invoice Id : ${filteredInvoices[i]._id}`);
        }
    }
        
};
async function generatePdf(invoiceData) {
    //invoice body : 
    const invoice_data = invoiceData;
    
    try {
        var template_path = __dirname.replace("routes", "templates") + "/templates" + "/invoice.html";
        var templateHtml = fs.readFileSync(template_path, "utf-8");
        var template = handlebars.compile(templateHtml);
        var finalHtml = encodeURIComponent(template(invoice_data));
        const pdfpath = __dirname.replace("routes", "Invoices") + "/" + `${invoiceData._id}.pdf`;
        var options = {
            path : pdfpath,
            format: "A4",
            printBackground: true
        };
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
        return true;
    } 
    catch (err) {
        console.error(err);
        return false;
    }
}

const deleteGenereatedPdfs = async (filteredInvoices) => {
    for (var i = 0; i < filteredInvoices.length; i++) {
        await fs.unlink(__dirname.replace("routes", "Invoices") + "/" + `${filteredInvoices[i]._id}.pdf`, function (err) {
            if (err)
                console.log("Files Deletion Unsuccessful");
            else
                console.log("Files Deleted Successfully");
        });
    }
};
const procedure = async() => {
    var filteredSchedulesForToday = await filterSchedules();
    var invoicesToSend = await filterInvoices(filteredSchedulesForToday);
    await invoicePdfsGeneration(invoicesToSend);
    await sendMail(invoicesToSend);
    await deleteGenereatedPdfs(invoicesToSend);
    ScheduleStatus.insertMany(scheduleStatus);

}; 
procedure();
// nodeCron.schedule("1 * * * * *", procedure);
