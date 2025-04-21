import express from 'express';
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
  getUser,
  verifyPan,
  verifyDocuments, // Import the new function
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
} from '../controllers/user.controller.js';

import { verifyToken } from '../utils/verifyUser.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id', verifyToken, getUser);

router.put(
  '/verify-pan',
  verifyToken,
  upload.single('panDocument'), // 👈 IMPORTANT: Must match FormData field name
  verifyPan
);

// New route for document verification
router.put(
  '/verify-documents',
  verifyToken,
  upload.fields([
    { name: 'panDocument', maxCount: 1 },
    { name: 'aadharDocument', maxCount: 1 }
  ]),
  verifyDocuments
);

// Favorites routes
router.post('/favorites/add/:listingId', verifyToken, addToFavorites);
router.delete('/favorites/remove/:listingId', verifyToken, removeFromFavorites);
router.get('/favorites/:id', verifyToken, getUserFavorites);

export default router;
