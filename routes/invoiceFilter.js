var express = require("express");
var router = express.Router();
var fs = require("fs");
var handlebars = require("handlebars");
var nodemailer = require('nodemailer');
var pdf = require('html-pdf');
const utils = require('util');
const puppeteer = require('puppeteer')

router.post("/", async (req, res) => {
    const info = req.body;
    //Template Path : 
    var template_path = __dirname.replace("routes", "templates") + "/" + "invoice.html";

    //Taking input body 
    for (var i = 0; i < info.invoiceData.length; i++) {

        const { client, invoice_number, bill_from, bill_to, ship_to, payment_terms, date, due_date, items, sub_total, tax, discount, total, amount_paid, balance_due, notes, terms } = req.body.invoiceData[i];

        // invoice body:
        const invoice_data = {
            _id: new mongoose.Types.ObjectId(),
            client,
            invoice_number,
            bill_from,
            bill_to,
            ship_to,
            payment_terms,
            date,
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


        //Reading HTML file :
        var templateHtml = fs.readFileSync(template_path, "utf-8");

        //Assigning values to HTML :
        var template = handlebars.compile(templateHtml);
        var finalHtml = template(invoice_data);


        //Format of our pdf :
        var options = {
            format: "A4",
            printBackground: true,
        };

        const fileName = __dirname.replace("routes", "Invoices") + "/" + `${info.month}-${info.year}-${info.invoiceData[i]._id}.pdf`;
        pdf.create(finalHtml, options).toFile(fileName, function (err, res) {
            if (err) return console.log(err);
            console.log(res);
        });
    }

    //----------------Mail sending-------------- 
    const invoices = []
    for (var i = 0; i < info.invoiceData.length; i++) {
        invoices.push({
            filename: `${info.month}-${info.year}-${info.invoiceData[i]._id}.pdf`,
            path: __dirname.replace("routes", "Invoices") + "/" + `${info.month}-${info.year}-${info.invoiceData[i]._id}.pdf`,
        })
    }
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: '2019med1003@iitrpr.ac.in',
            pass: 'Anuradha@99'
        }
    });

    var mailOptions = {
        from: 'CodeUnity Technologies private Limited',
        to: info.toEmail,
        subject: `Codeunity Technologies GST Invoices Report for ${info.month} / ${info.year}`,
        text: `Hello Auditor, Please find the attached invoices for the ${info.month} / ${info.year} below`,
        attachments: invoices,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email Sent Successfullly')
    }
    catch (error) {
        console.log('inside catch');
        console.log(error);
    }


    // for (var i = 0; i < info.invoiceData.length; i++) {
    //     fs.unlink(__dirname.replace("routes", "Invoices") + "/" + `${info.month}-${info.year}-${info.invoiceData[i]._id}.pdf`, function (err) {
    //         if (err)
    //             console.log('Files Deletion Unsuccessful')
    //         else
    //             console.log('Files Deleted Successfully')
    //     })
    // }
}
)

module.exports = router;

