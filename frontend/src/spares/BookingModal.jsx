const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Ground = require('../models/Ground');
const {generateBookingID} = require('../Utils');

router.post('/book-slot', async (req, res) => {
    // const { ground_id, date, slots , comboPack  } = req.body;
   
    const { ground_id, date, slots, comboPack } = req.body;

  
    try {
      // Calculate the price based on the number of slots booked
      const pricePerHour = 800; 
      const slotDurationInHours = 0.5;
      const pricePerSlot = pricePerHour * slotDurationInHours;
      const totalPriceForSlots = slots.length * pricePerSlot;
        
      // Combo pack price
    const comboPackPrice = comboPack ? 80 : 0; // If comboPack is true, add 80 INR

    // Total price calculation
    const totalPrice = totalPriceForSlots + comboPackPrice;

      // Generate a unique booking ID
      const booking_id = generateBookingID();
  
      // Create a new booking entry
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
  
      // Save the booking to the database
      await newBooking.save();
     // Find the ground and update the slots
     const ground = await Ground.findOne({ ground_id });

     if (!ground) {
         return res.status(404).json({ message: 'Ground not found' });
     }
 
     // Check if any of the requested slots are already booked
     const alreadyBookedSlots = ground.slots.booked.filter(slot => slots.includes(slot));

     if (alreadyBookedSlots.length > 0) {
         return res.status(400).json({
             message: 'Requested slots have already been booked',
             bookedSlots: alreadyBookedSlots,
         });
     }

     // Update the booked slots
     const updatedBookedSlots = [...new Set([...ground.slots.booked, ...slots])]; // Ensure uniqueness
    

     ground.slots.booked = updatedBookedSlots;

     // Save the updated ground document
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
      res.status(500).send('Server error');
    }
  });
  


module.exports = router;
