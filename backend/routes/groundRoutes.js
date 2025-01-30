
import express from 'express';
const router = express.Router();
import { createGround , getGroundsByLocation , getGroundsByIdandDate } from '../controllers/groundsController.js';
//import upload from '../middleware/upload.js'; // Use default import here
//import upload from '../middleware/imageUpload.js';
import {upload} from '../middleware/upload.js';
//router.route('/createGround').post(upload.single('photo'), createGround);
router.route('/createGround').post(upload.single("photo"), createGround);
router.route('/').get(getGroundsByLocation);

router.route('/:ground_id').get(getGroundsByIdandDate)

export default router;
