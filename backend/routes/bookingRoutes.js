import express from "express";
const router = express.Router();

import { bookingGround , getBookings , getBookingDetailsBySlot , deleteBookingDetailsById, updateBookingPrice} from "../controllers/bookingController.js";

router.route('/book-slot').post(bookingGround);
router.route('/getbookingdetails').get(getBookings);
router.route('/bookdetails').get(getBookingDetailsBySlot);
router.route('/deletebooking').delete(deleteBookingDetailsById);
router.route('/updateprice').put(updateBookingPrice);

export default router;
