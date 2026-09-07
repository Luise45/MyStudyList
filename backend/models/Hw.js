
//Mongodb template 

const mongoose = require('mongoose');


const hwSchema = new mongoose.Schema({

   
    date: { type: Date, required: true},
    subject: { type: String, required: true},
    task_type: { type: String, required: true},
    notes: { type: String}
    
}, {

    timestamps: true
});

module.exports = mongoose.model('Hw', hwSchema);