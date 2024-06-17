import multer from 'multer';
import path from 'path';

const baseDir = 'uploads/';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'image') {
      cb(null, path.join(baseDir, 'images/'));
    } else {
      cb(null, path.join(baseDir, 'files/'));
    }
  },
  filename(req, file, cb) {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const fileFilterForImages = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new Error('Only images are allowed'));
  }
  cb(null, true);
};

export const upload = multer({ storage });

export const uploadSingleImage = multer({
  storage,
  fileFilterForImages,
}).single('image');

export const uploadSingleFile = multer({
  storage,
}).single('file');
