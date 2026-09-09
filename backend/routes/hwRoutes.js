const express = require('express');
const router = express.Router();

const Hw = require('../models/Hw');
const auth = require('../middleware/auth');

// Eintrag erstellen
router.post('/', auth, async (req, res) => {
  try {
    const { date, subject, task_type, notes } = req.body;

    const newHw = new Hw({
      date,
      subject,
      task_type,
      notes,
      user: req.userId
    });

    await newHw.save();

    res.status(201).json({
      message: 'Hw uploaded successfully',
      hw: newHw
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Einträge des eingeloggten Users erhalten
router.get('/', auth, async (req, res) => {
  try {
    const hws = await Hw.find({
      user: req.userId
    });

    res.json(hws);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Einen Eintrag mit ID erhalten
router.get('/:id', auth, async (req, res) => {
  try {
    const hw = await Hw.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!hw) {
      return res.status(404).json({
        message: 'Hw not found'
      });
    }

    res.json(hw);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Eintrag löschen
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedHw = await Hw.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!deletedHw) {
      return res.status(404).json({
        message: 'Hw not found'
      });
    }

    res.json({
      message: 'HW deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;