import Epaper from '../../models/Epaper.js';

// @desc    Get all epapers
// @route   GET /api/user/epaper
// @access  Public
export const getAllEpapers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const epapers = await Epaper.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Epaper.countDocuments();

    res.json({
      success: true,
      data: epapers,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get epaper by ID
// @route   GET /api/user/epaper/:id
// @access  Public
export const getEpaperById = async (req, res) => {
  try {
    const epaper = await Epaper.findById(req.params.id);

    if (!epaper) {
      return res.status(404).json({
        success: false,
        message: 'E-paper not found'
      });
    }

    // Increment views
    epaper.views += 1;
    await epaper.save();

    res.json({
      success: true,
      data: epaper
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

