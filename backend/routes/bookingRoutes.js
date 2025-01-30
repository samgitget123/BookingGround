import express from "express";
const router = express.Router();

import { bookingGround , getBookings , getBookingDetailsBySlot} from "../controllers/bookingController.js";

router.route('/book-slot').post(bookingGround);
router.route('/getbookingdetails').get(getBookings);
router.route('/bookdetails').get(getBookingDetailsBySlot);

export default router;
