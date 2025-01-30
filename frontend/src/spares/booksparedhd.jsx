// module.exports = router;
import express from "express";
const router = express.Router();
import asynHandler from "../middleware/asyncHandler.js";
// const Booking = require('../models/Booking');
import Booking from "../models/Booking.js";
// const Ground = require('../models/Ground');
import Ground from "../models/Ground.js";
//const { generateBookingID } = require('../Utils');
import generateBookingID from "../Utils.js";

router.post(
  "/book-slot",
  asynHandler(async (req, res) => {
    const { ground_id, date, slots, comboPack } = req.body;
    try {
      // Convert the requested date to a JavaScript Date object
      const bookingDate = new Date(date);
      const currentDate = new Date();

      // If the booking date is in the past, deny the booking
      if (bookingDate < currentDate.setHours(0, 0, 0, 0)) {
        return res
          .status(400)
          .json({ message: "You cannot book a slot for a past date." });
      }

      // Check if the selected slots are in the past on the same day
      const currentTime = new Date();
      const [currentHour, currentMinute] = [
        currentTime.getHours(),
        currentTime.getMinutes(),
      ];

      const isSlotInPast = slots.some((slot) => {
        const [slotHour, slotHalf] = slot.split(".").map(Number);
        const slotMinute = slotHalf === 0 ? 0 : 30;

        // If booking for today, compare slot times with the current time
        if (bookingDate.toDateString() === currentTime.toDateString()) {
          if (
            slotHour < currentHour ||
            (slotHour === currentHour && slotMinute <= currentMinute)
          ) {
            return true; // Slot is in the past
          }
        }
        return false;
      });

      if (isSlotInPast) {
        return res
          .status(400)
          .json({ message: "Cannot book past time slots." });
      }

      // Calculate price for slots and combo pack
      const pricePerHour = 800;
      const slotDurationInHours = 0.5;
      const pricePerSlot = pricePerHour * slotDurationInHours;
      const totalPriceForSlots = slots.length * pricePerSlot;

      // Combo pack price
      const comboPackPrice = comboPack ? 80 : 0;

      // Total price
      const totalPrice = totalPriceForSlots + comboPackPrice;

      // Generate unique booking ID
      const booking_id = generateBookingID();

      // Create a new booking
      const newBooking = new Booking({
        ground_id,
        date,
        slots,
        comboPack,
        book: {
          booking_id,
          price: totalPrice,
        },
      });

      // Save the booking
      await newBooking.save();

      // Find the ground and update booked slots
      const ground = await Ground.findOne({ ground_id });
      if (!ground) {
        return res.status(404).json({ message: "Ground not found" });
      }

      // const alreadyBookedSlots = ground.slots.booked.filter((slot) =>
      //   slots.includes(slot)
      // );
      // console.log(alreadyBookedSlots , 'alreadybooked');
      // if (alreadyBookedSlots.length > 0) {
      //   return res.status(400).json({
      //     message: "Requested slots have already been booked",
      //     bookedSlots: alreadyBookedSlots,
      //   });
      // }
      // const bookingsOnDate = await Booking.findOne({ ground_id, date });
      // console.log(bookingsOnDate , 'bookondate');
      // let alreadyBookedSlots = [];
      // if (bookingsOnDate) {
      //   alreadyBookedSlots = bookingsOnDate.slots.filter((slot) =>
      //     slots.includes(slot)
      //   );
      // }
      // if (bookingsOnDate) {
      //   alreadyBookedSlots = bookingsOnDate.slots.filter((slot) =>
      //     slots.includes(slot)
      //   );
      //   console.log("Already Booked Slots:", alreadyBookedSlots);
      // }

      // if (alreadyBookedSlots.length > 0) {
      //   return res.status(400).json({
      //     message: "Requested slots have already been booked for this date",
      //     bookedSlots: alreadyBookedSlots,
      //   });
      // }
      // const updatedBookedSlots = [...new Set([...ground.slots.booked, ...slots])];

      // ground.slots.booked = updatedBookedSlots;
      // Add new slots to the booked slots array
      // ground.slots.booked = [...ground.slots.booked, ...slots].filter(
      //   (value, index, self) => self.indexOf(value) === index
      // ); // Ensure uniqueness
      // Find the booked slots for the specific date
      let dateSlotEntry = ground.slots.find((slot) => slot.date === date);

      if (!dateSlotEntry) {
        // If no entry exists for the date, create one
        dateSlotEntry = { date, bookedSlots: [] };
        ground.slots.push(dateSlotEntry);
      }

      // Check if any of the requested slots are already booked for this date
      const alreadyBookedSlots = dateSlotEntry.bookedSlots.filter((slot) =>
        slots.includes(slot)
      );

      if (alreadyBookedSlots.length > 0) {
        return res.status(400).json({
          message: "Requested slots have already been booked for this date",
          bookedSlots: alreadyBookedSlots,
        });
      }

      // Add the new slots to the booked slots array for this date
      dateSlotEntry.bookedSlots = [
        ...dateSlotEntry.bookedSlots,
        ...slots,
      ].filter((value, index, self) => self.indexOf(value) === index); // Ensure uniqueness

      await ground.save();

      // Respond with the booking details
      res.json({
        ground_id,
        date,
        slots,
        comboPack,
        book: {
          booking_id,
          price: totalPrice,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  })
);

export default router;
