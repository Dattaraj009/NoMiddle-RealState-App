import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create directories if they don't exist
const createUploadDirectories = () => {
  const dirs = [
    'uploads',
    'uploads/pancards',
    'uploads/aadharcards'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Create directories on startup
createUploadDirectories();

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination folder based on field name
    let uploadPath = 'uploads/pancards';
    
    if (file.fieldname === 'aadharDocument') {
      uploadPath = 'uploads/aadharcards';
    }
    
    // Make sure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

// File filter for image/pdf
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});
