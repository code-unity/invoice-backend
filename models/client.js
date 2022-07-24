//Dependencies Imported :
var mongoose = require('mongoose')

//Client Schema :
var clientSchema = mongoose.Schema({
  //Object ID : (Unique ID, automatically created by MongoDb)
  _id: mongoose.Schema.Types.ObjectId,

  //Validation for client name :
  client_name: {
    type: String,
    unique: [true, 'client name already exists'],
    required: [true, 'please enter client name'],
  },

  //Validation for billing address :
  billing_address: {
    type: String,
    required: [true, 'please enter billing address'],
  },

  //Validation for shipping address :
  shipping_address: {
    type: String,
    required: [true, 'please enter shipping address'],
  },

  //Validation for date of contract :
  date_of_contract: {
    type: String,
    required: [true, 'please Enter date of contract'],
  },

  //Validation for payment terms :
  payment_terms: {
    type: String,
    required: [true, 'please enter payment terms'],
  },

  //Validation for notes :
  notes: {
    type: String,
    required: false,
  },

  //Validation for terms :
  terms: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  //validation for toEmail
  toEmails: {
    type: [],
    required: [true, 'please enter a Email Id'],
  },

  //validation for ccEmails
  ccEmails: {
    type: [],
    required: false,
  },
})

module.exports = mongoose.model('Client', clientSchema)
