import Epaper from '../../models/Epaper.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinaryUpload.js';

// @desc    Get all epapers
// @route   GET /api/admin/epaper
// @access  Private (Admin)
export const getAllEpapers = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 25 } = req.query;

    // Build query
    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const epapers = await Epaper.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Epaper.countDocuments(query);

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

// @desc    Upload epaper
// @route   POST /api/admin/epaper
// @access  Private (Admin)
export const uploadEpaper = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload PDF file'
      });
    }

    // Check if epaper for this date already exists
    const existingEpaper = await Epaper.findOne({ date: new Date(date) });
    if (existingEpaper) {
      return res.status(400).json({
        success: false,
        message: 'E-paper for this date already exists'
      });
    }

    // Upload PDF to Cloudinary
    const pdfResult = await uploadToCloudinary(req.file, 'hamarasamachar/epaper', 'raw');

    // Upload cover image if provided
    let coverUrl = '';
    if (req.body.coverImage) {
      // If cover image is provided as base64 or URL, handle accordingly
      // For now, assuming it's uploaded separately
      coverUrl = req.body.coverImage;
    }

    const epaper = await Epaper.create({
      date: new Date(date),
      pdfUrl: pdfResult.secure_url,
      coverUrl: coverUrl,
      fileName: req.file.originalname,
      views: 0
    });

    res.status(201).json({
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

// @desc    Delete epaper
// @route   DELETE /api/admin/epaper/:id
// @access  Private (Admin)
export const deleteEpaper = async (req, res) => {
  try {
    const epaper = await Epaper.findById(req.params.id);

    if (!epaper) {
      return res.status(404).json({
        success: false,
        message: 'E-paper not found'
      });
    }

    // Delete PDF from Cloudinary
    try {
      const publicId = epaper.pdfUrl.split('/').pop().split('.')[0];
      await deleteFromCloudinary(`hamarasamachar/epaper/${publicId}`);
    } catch (error) {
      console.error('Error deleting PDF:', error);
    }

    // Delete cover image if exists
    if (epaper.coverUrl) {
      try {
        const coverPublicId = epaper.coverUrl.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`hamarasamachar/epaper/${coverPublicId}`);
      } catch (error) {
        console.error('Error deleting cover image:', error);
      }
    }

    await epaper.deleteOne();

    res.json({
      success: true,
      message: 'E-paper deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

