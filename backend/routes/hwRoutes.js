const express = require('express');
const router = express.Router();

const path = require('path');

const Hw = require('../models/Hw');


// Eintrag erstellen (backend)

router.post('/', async (req, res) => {
  try {
    const { date, subject, task_type, notes } = req.body;
    
    const newHw = new Hw({ date, subject, task_type, notes });
    await newHw.save();
    res.status(201).json({ message: 'Hw uploaded successfully', hw: newHw });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Eintraege erhalten (backend)

router.get('/', async (req, res) => {
  try {
    const hws = await Hw.find();
    res.json(hws);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Eintrag erhalten mit id

router.get('/:id', async (req, res) => {
    try{
        const hw = await Hw.findById(req.params.id);
        if(!hw) return res.status(404).json({ message:'Hw not found'});
        res.json(hw); 
    }catch (err){
    
        res.status(500).json({ error: err.message });
    }
    });

//Eintrag loeschen mit id

router.delete('/:id', async (req, res) => {
  try {
    const deletedHw = await Hw.findByIdAndDelete(req.params.id);
    if (!deletedHw) {
      return res.status(404).json({ message: 'Hw not found' });
    }
    res.json({ message: 'HW deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
  