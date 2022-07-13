var express = require("express");
var router = express.Router();
var fs = require("fs");
var handlebars = require("handlebars");
var nodemailer = require('nodemailer');
var pdf = require('html-pdf');
const utils = require('util');
const puppeteer = require('puppeteer')
const readFile = utils.promisify(fs.readFile)
const { validationResult } = require("express-validator");


//Validations Imported :
var invoiceFilterValidator = require("../validations/invoiceFilter_validations");


//function for reading  the html file
async function getTemplateHtml() {

    //Template Path :
    var template_path = __dirname.replace("routes", "templates") + "/" + "invoice.html";
    try {
        return await readFile(template_path, 'utf8');
    } catch (err) {
        return Promise.reject("Could not load html template");
    }
}

//Function for Invoice Pdf's Generation 
async function generatePdf(invoiceData, month, year) {

    // Taking input body  
    const { _id, client, invoice_number, bill_from, bill_to, ship_to, payment_terms, date, due_date, items, sub_total, tax, discount, total, amount_paid, balance_due, notes, terms } = invoiceData;

    // invoice body: 
    const invoice_data = {
        _id,
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
    try {
        let res = await getTemplateHtml()
        // Now we have the html code of our template in res object
        // we have compile our code with handlebars
        const template = handlebars.compile(res, { strict: true });
        // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. 
        const result = template(invoice_data);
        const html = result;
        // we are using headless mode
        const browser = await puppeteer.launch();
        const page = await browser.newPage()
        // We set the page content as the generated html by handlebars
        await page.setContent(html)
        // We use pdf function to generate the pdf in the desired folder
        const pdfpath = __dirname.replace("routes", "Invoices") + "/" + `${invoice_number}-${month}-${year}.pdf`;

        //format of our pdf is A4
        await page.pdf({ path: pdfpath, format: 'A4', printBackground: true, })
        await browser.close();
        console.log("PDF Generated")
    } catch (err) {
        console.error(err)
    }
}

//for loop for pdf Generation
const invoicePdfsGeneration = async (invoiceData, month, year) => {

    for (var i = 0; i < invoiceData.length; i++)
        await generatePdf(invoiceData[i], month, year);

}

//function for sending the Generated invoices pdf via provided mail  
const sendingInvoicesViaMail = async (invoiceData, month, year, toEmails, ccEmails) => {
    const invoices = []
    for (var i = 0; i < invoiceData.length; i++) {
        invoices.push({
            filename: `${invoiceData[i].invoice_number}-${month}-${year}.pdf`,
            path: __dirname.replace("routes", "Invoices") + "/" + `${invoiceData[i].invoice_number}-${month}-${year}.pdf`,
        })
    }
    var transporter = await nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: '2019med1003@iitrpr.ac.in',
            pass: 'Anuradha@99'
        }
    });

    var mailOptions = {
        from: 'CodeUnity Technologies private Limited',
        to: toEmails,
        cc: ccEmails,
        subject: `Codeunity Technologies GST Invoices Report for ${month} / ${year}`,
        text: `Hello Auditor, Please find the attached invoices for the ${month} / ${year} below`,
        attachments: invoices,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email Sent Successfullly')
    }
    catch (error) {
        console.log('Email not sent')
        console.log(error);
    }
}

//Function to delete the generated PDF's
const deleteGenereatedPdfs = async (invoiceData, month, year) => {
    for (var i = 0; i < invoiceData.length; i++) {
        await fs.unlink(__dirname.replace("routes", "Invoices") + "/" + `${invoiceData[i].invoice_number}-${month}-${year}.pdf`, function (err) {
            if (err)
                console.log('Files Deletion Unsuccessful')
            else
                console.log('Files Deleted Successfully')
        })
    }
}

router.post("/", invoiceFilterValidator(), async (req, res) => {

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

    const info = req.body;

    //calling the pdf's generation function
    await invoicePdfsGeneration(info.invoiceData, info.month, info.year);

    //calling the mail sending function
    await sendingInvoicesViaMail(info.invoiceData, info.month, info.year, info.toEmails, info.ccEmails);

    await deleteGenereatedPdfs(info.invoiceData, info.month, info.year);
}
)

module.exports = router;

