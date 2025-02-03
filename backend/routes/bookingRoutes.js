import express from "express";
const router = express.Router();

import { bookingGround , getBookings , getBookingDetailsBySlot , deleteBookingDetailsById, updateBookingPrice , getAllBookings, searchBookings} from "../controllers/bookingController.js";

router.route('/book-slot').post(bookingGround);
router.route('/getbookingdetails').get(getBookings);
router.route('/bookdetails').get(getBookingDetailsBySlot);
router.route('/deletebooking').delete(deleteBookingDetailsById);
router.route('/updateprice').put(updateBookingPrice);
router.route('/getallbookings').get(getAllBookings);
router.route('/search').get(searchBookings);
export default router;
