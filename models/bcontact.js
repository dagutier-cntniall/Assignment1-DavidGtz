let mongoose = require('mongoose');

// create a model class
let bcontactModel = mongoose.Schema({
    name: String,
    email: String
},
{
    collection: "bcontacts"
});

module.exports = mongoose.model('Bcontact', bcontactModel);