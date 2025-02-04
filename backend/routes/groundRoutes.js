
import express from 'express';
const router = express.Router();
import { createGround , getGroundsByLocation , getGroundsByIdandDate } from '../controllers/groundsController.js';
import {upload} from '../middleware/upload.js';
router.route('/createGround').post(upload.array("photo", 5), createGround);
router.route('/').get(getGroundsByLocation);

router.route('/:ground_id').get(getGroundsByIdandDate)

export default router;
