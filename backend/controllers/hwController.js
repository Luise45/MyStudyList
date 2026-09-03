const hwService = require('../services/hwService');

const createHw = async (req, res) => {
  try {
    const newHw = await hwService.createHw(req.body);

    res.status(201).json({
      message: 'Hw uploaded successfully',
      hw: newHw
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

const getAllHws = async (req, res) => {
  try {
    const hws = await hwService.getAllHws();

    res.json(hws);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

const getHwById = async (req, res) => {
  try {
    const hw = await hwService.getHwById(req.params.id);

    if (!hw) {
      return res.status(404).json({
        message: 'Hw not found'
      });
    }

    res.json(hw);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

const deleteHw = async (req, res) => {
  try {
    const deletedHw = await hwService.deleteHw(req.params.id);

    if (!deletedHw) {
      return res.status(404).json({
        message: 'Hw not found'
      });
    }

    res.json({
      message: 'HW deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  createHw,
  getAllHws,
  getHwById,
  deleteHw
};