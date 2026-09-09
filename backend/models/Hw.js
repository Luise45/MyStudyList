
//Mongodb template 

const mongoose = require('mongoose');


const hwSchema = new mongoose.Schema({

   
    date: { type: Date, required: true},
    subject: { type: String, required: true},
    task_type: { type: String, required: true},
    notes: { type: String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

}, 

{

    timestamps: true
}

);

module.exports = mongoose.model('Hw', hwSchema);