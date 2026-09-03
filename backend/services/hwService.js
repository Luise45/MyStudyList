const Hw = require('../models/Hw');

const createHw = async (hwData) => {
  const { date, subject, task_type, notes } = hwData;

  const newHw = new Hw({
    date,
    subject,
    task_type,
    notes
  });

  return await newHw.save();
};

const getAllHws = async () => {
  return await Hw.find();
};

const getHwById = async (id) => {
  return await Hw.findById(id);
};

const deleteHw = async (id) => {
  return await Hw.findByIdAndDelete(id);
};

module.exports = {
  createHw,
  getAllHws,
  getHwById,
  deleteHw
};