import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const verifyPan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pancard } = req.body;
    const filePath = req.file?.path;

    if (!pancard || !filePath) {
      return res.status(400).json({ message: 'PAN number and document required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        panNumber: pancard,
        panCardUrl: filePath,
        panVerified: false, // Verification pending
      },
      { new: true }
    );

    res.status(200).json({
      message: 'PAN verification info submitted',
      user: {
        panNumber: updatedUser.panNumber,
        panCardUrl: updatedUser.panCardUrl,
      },
    });
  } catch (error) {
    console.error('PAN verification error:', error);
    res.status(500).json({ message: 'Error submitting PAN info', error: error.message });
  }
};

export const verifyDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pancard, aadharcard } = req.body;
    
    // Access uploaded files from req.files
    const panDocument = req.files?.panDocument?.[0];
    const aadharDocument = req.files?.aadharDocument?.[0];

    if (!pancard || !aadharcard || !panDocument || !aadharDocument) {
      return res.status(400).json({ 
        message: 'Both PAN and Aadhaar numbers and documents are required' 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        panNumber: pancard,
        panCardUrl: panDocument.path,
        panVerified: false, // Verification pending
        aadharNumber: aadharcard,
        aadharDocUrl: aadharDocument.path,
        isAadharVerified: false, // Verification pending
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Documents verification info submitted successfully',
      user: {
        panNumber: updatedUser.panNumber,
        panCardUrl: updatedUser.panCardUrl,
        aadharNumber: updatedUser.aadharNumber,
        aadharDocUrl: updatedUser.aadharDocUrl,
      },
    });
  } catch (error) {
    console.error('Document verification error:', error);
    res.status(500).json({ message: 'Error submitting document info', error: error.message });
  }
};

// Add a listing to user's favorites
export const addToFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.params;
    
    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }
    
    // Check if listing is already in favorites
    const user = await User.findById(userId);
    if (user.favorites.includes(listingId)) {
      return res.status(200).json({ 
        success: true,
        message: 'Listing is already in favorites'
      });
    }
    
    // Add to favorites
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { favorites: listingId }
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Listing added to favorites',
      favorites: updatedUser.favorites
    });
  } catch (error) {
    next(error);
  }
};

// Remove a listing from user's favorites
export const removeFromFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.params;
    
    // Remove from favorites
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { favorites: listingId }
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Listing removed from favorites',
      favorites: updatedUser.favorites
    });
  } catch (error) {
    next(error);
  }
};

// Get user's favorite listings
export const getUserFavorites = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can only view your own favorites'));
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    
    // Fetch the complete listing data for each favorite
    const favorites = await Listing.find({
      _id: { $in: user.favorites }
    });
    
    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};

