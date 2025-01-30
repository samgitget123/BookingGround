import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Correctly reference the 'uploads' folder at the root of the project
const uploadsDir = path.resolve('uploads'); // This will resolve to 'C:/sampath/projects/bookingApp/uploads'
// Ensure 'uploads' directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);  // Use the absolute path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});
// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};
// Export the upload configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit: 2MB
});