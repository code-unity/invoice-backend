var express = require("express");
var router = express.Router();
var fs = require("fs");
var handlebars = require("handlebars");
var nodemailer = require('nodemailer');
var pdf = require('html-pdf');
const utils = require('util');
const puppeteer = require('puppeteer')
const readFile = utils.promisify(fs.readFile)

//Function for Invoice Pdf's Generation 
const invoicePdfsGeneration = (invoiceData, month, year) => {

    //Template Path :
    var template_path = __dirname.replace("routes", "templates") + "/" + "invoice.html";

    //reading the html file
    async function getTemplateHtml() {
        try {
            return await readFile(template_path, 'utf8');
        } catch (err) {
            return Promise.reject("Could not load html template");
        }
    }

    for (var i = 0; i < invoiceData.length; i++) {

        async function generatePdf() {

            // Taking input body  
            const { _id, client, invoice_number, bill_from, bill_to, ship_to, payment_terms, date, due_date, items, sub_total, tax, discount, total, amount_paid, balance_due, notes, terms } = invoiceData[i];

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
            getTemplateHtml().then(async (res) => {
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
            }).catch(err => {
                console.error(err)
            });
        }
        generatePdf();
    }
}

//function for sending the Generated invoices pdf via provided mail  
const sendingInvoicesViaMail = (invoiceData, month, year, toEmail) => {
    const invoices = []
    for (var i = 0; i < invoiceData.length; i++) {
        invoices.push({
            filename: `${invoiceData[i].invoice_number}-${month}-${year}.pdf`,
            path: __dirname.replace("routes", "Invoices") + "/" + `${invoiceData[i].invoice_number}-${month}-${year}.pdf`,
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
        to: toEmail,
        subject: `Codeunity Technologies GST Invoices Report for ${month} / ${year}`,
        text: `Hello Auditor, Please find the attached invoices for the ${month} / ${year} below`,
        attachments: invoices,
    };

    try {
        transporter.sendMail(mailOptions);
        console.log('Email Sent Successfullly')
    }
    catch (error) {
        console.log('Email not sent')
        console.log(error);
    }
}

//Function to delete the generated PDF's
const deleteGenereatedPdfs = (invoiceData, month, year) => {
    for (var i = 0; i < invoiceData.length; i++) {
        fs.unlink(__dirname.replace("routes", "Invoices") + "/" + `${invoiceData[i].invoice_number}-${month}-${year}.pdf`, function (err) {
            if (err)
                console.log('Files Deletion Unsuccessful')
            else
                console.log('Files Deleted Successfully')
        })
    }
}

router.post("/", async (req, res) => {
    const info = req.body;

    //calling the pdf's generation function
    invoicePdfsGeneration(info.invoiceData, info.month, info.year);

    //calling the mail sending function
    sendingInvoicesViaMail(info.invoiceData, info.month, info.year, info.toEmail);

    // deleteGenereatedPdfs(info.invoiceData, info.month, info.year);
}
)

module.exports = router;

