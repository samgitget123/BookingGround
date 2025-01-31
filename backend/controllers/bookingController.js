import asyncHandler from "../middleware/asyncHandler.js";
import Booking from "../models/Booking.js";
// const Ground = require('../models/Ground');
import Ground from "../models/Ground.js";
//const { generateBookingID } = require('../Utils');
import generateBookingID from "../Utils.js";

// const bookingGround =  asyncHandler(async (req, res) => {
//     const { ground_id, date, slots, comboPack, name, mobile, email } = req.body;

//     const bookingDateformat = new Date(date);
//     const bookingDate = bookingDateformat.toISOString().slice(0, 10); // '2025-01-29'

//     const ground = await Ground.findOne({ ground_id });
//     if (!ground) {
//       return res.status(404).json({ message: "Ground not found" });
//     }

//     // Ensure the slots field is initialized if not present
//     if (!ground.slots) {
//       ground.slots = new Map();
//     }

//     // Access the slot for the selected date
//     let dateSlotEntry = ground.slots.get(bookingDate);

//     if (!dateSlotEntry) {
//       // If no slots exist for this date, initialize with an empty array
//       dateSlotEntry = { bookedSlots: [] };
//       ground.slots.set(bookingDate, dateSlotEntry);
//     }

    

//     // Check if any of the selected slots are already booked
//     const alreadyBooked = dateSlotEntry.bookedSlots.filter((slot) =>
//       slots.includes(slot)
//     );

//     if (alreadyBooked.length > 0) {
//       return res.status(409).json({
//         message: "Some slots are already booked",
//         conflicts: alreadyBooked,
//       });
//     }

//     // Update the bookedSlots array with the selected slots
//     dateSlotEntry.bookedSlots.push(...slots);

//     // Ensure uniqueness of booked slots (optional, in case of any duplication)
//     dateSlotEntry.bookedSlots = [...new Set(dateSlotEntry.bookedSlots)];
//     if(dateSlotEntry.bookedSlots){
//       console.log("Updated Booked Slots: ", dateSlotEntry.bookedSlots);
//       ground.markModified('slots');
//       // Save the updated ground document with booked slots
//       await ground.save();
//     }
  
//     // Calculate total price based on slots and combo pack
//     const pricePerSlot = 800 * 0.5; // Slot duration = 0.5 hours
//     const totalPrice = slots.length * pricePerSlot + (comboPack ? 80 : 0);
   
//     // Generate booking ID
//     const booking_id = generateBookingID();

//     // Create the booking entry
//     const booking = new Booking({
//       ground_id,
//       date,
//       slots,
//       comboPack,
//       name,         
//       mobile,       
//       email,        
//       book: { booking_id, price: totalPrice },
//       paymentStatus: "pending",
//     });
//     await booking.save();

//     // Return the success response
//     res.status(201).json({
//       success: true,
//       data: { ground_id, date, slots, comboPack, price: totalPrice, booking_id, name, mobile, email },
//       message: "Slot booked successfully",
//     });
// });
const bookingGround = asyncHandler(async (req, res) => {
  const { ground_id, date, slots, comboPack, name, mobile, email } = req.body;

  const bookingDateformat = new Date(date);
  const bookingDate = bookingDateformat.toISOString().slice(0, 10); // '2025-01-29'

  const ground = await Ground.findOne({ ground_id });
  if (!ground) {
    return res.status(404).json({ message: "Ground not found" });
  }

  // Ensure the slots field is initialized if not present
  if (!ground.slots) {
    ground.slots = new Map();
  }

  // Access the slot for the selected date
  let dateSlotEntry = ground.slots.get(bookingDate);

  if (!dateSlotEntry) {
    // If no slots exist for this date, initialize with an empty array
    dateSlotEntry = { bookedSlots: [] };
    ground.slots.set(bookingDate, dateSlotEntry);
  }

  // Check if any of the selected slots are already booked
  const alreadyBooked = dateSlotEntry.bookedSlots.filter((slot) =>
    slots.includes(slot)
  );

  if (alreadyBooked.length > 0) {
    return res.status(409).json({
      message: "Some slots are already booked",
      conflicts: alreadyBooked,
    });
  }

  // Update the bookedSlots array with the selected slots
  dateSlotEntry.bookedSlots.push(...slots);

  // Ensure uniqueness of booked slots (optional, in case of any duplication)
  dateSlotEntry.bookedSlots = [...new Set(dateSlotEntry.bookedSlots)];

  // Ensure the ground schema is updated with the new slots
  ground.markModified('slots');

  // Save the updated ground document with booked slots
  await ground.save();

  // Calculate total price based on slots and combo pack
  const pricePerSlot = 800 * 0.5; // Slot duration = 0.5 hours
  const totalPrice = slots.length * pricePerSlot + (comboPack ? 80 : 0);

  // Generate booking ID
  const booking_id = generateBookingID();

  // Create the booking entry
  const booking = new Booking({
    ground_id,
    date,
    slots,
    comboPack,
    name,
    mobile,
    email,
    book: { booking_id, price: totalPrice },
    paymentStatus: "pending",
  });
  await booking.save();

  // Return the success response
  res.status(201).json({
    success: true,
    data: { ground_id, date, slots, comboPack, price: totalPrice, booking_id, name, mobile, email },
    message: "Slot booked successfully",
  });
});

const getBookings = asyncHandler(async (req, res) => {
  const { ground_id, date, slots } = req.query;

  // Check if any required fields are missing
  if (!ground_id || !date || !slots) {
      return res.status(400).json({ message: "Please provide ground_id, date, and slots" });
  }

  // Convert slots into an array of strings (in case of single slot input)
  const selectedSlots = Array.isArray(slots) ? slots : [slots];

  // Find bookings that match the provided filters
  const bookings = await Booking.find({
      ground_id,
      date,
      slots: { $in: selectedSlots }  // Match any booking with the selected slots
  });

  if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for the given filters" });
  }

  // Return the filtered bookings
  res.status(200).json({
      success: true,
      data: bookings,
      message: "Bookings retrieved successfully",
  });
});

//get booking details by slot
const getBookingDetailsBySlot = asyncHandler(async (req, res) => {
  const { ground_id, date, slot } = req.query;

  // Check if required fields are provided
  if (!ground_id || !date || !slot) {
    return res.status(400).json({ message: "Please provide ground_id, date, and slot" });
  }

  // Find bookings for the specific slot on the provided date and ground
  const bookings = await Booking.find({
    ground_id,
    date,
    slots: slot,  // Match the specific slot
  });

  if (bookings.length === 0) {
    return res.status(404).json({ message: "No bookings found for the given slot" });
  }

  // Return the booking details for the specific slot
  res.status(200).json({
    success: true,
    data: bookings,
    message: "Booking details retrieved successfully",
  });
});


//Delete the booking slots 
// const deleteBookingDetailsById = asyncHandler(async (req, res) => {
//   const { booking_id, ground_id } = req.query;

//   // Check if required fields are provided
//   if (!booking_id || !ground_id) {
//     return res.status(400).json({ message: "Please provide booking_id and ground_id" });
//   }

//   // Find the booking to delete
//   const booking = await Booking.findOneAndDelete({
//     _id: booking_id,
//     ground_id,
//   });

//   if (!booking) {
//     return res.status(404).json({ message: "Booking not found for the given booking_id and ground_id" });
//   }

//   // Update the Ground's slots to remove the booked slots
//   const ground = await Ground.findOne({ ground_id });

//   if (!ground) {
//     return res.status(404).json({ message: "Ground not found for the given ground_id" });
//   }

//   // Remove booked slots from the Ground's slot list
//   const updatedSlots = { ...ground.slots };

//   booking.slots.forEach((slot) => {
//     if (updatedSlots.has(slot)) {
//       // Remove the slot from bookedSlots
//       const bookedSlots = updatedSlots.get(slot).bookedSlots;
//       const index = bookedSlots.indexOf(booking_id);
//       if (index > -1) {
//         bookedSlots.splice(index, 1);
//       }
//     }
//   });

//   // Save the updated ground with the removed slots
//   await ground.updateOne({
//     $set: { slots: updatedSlots },
//   });

//   // Return success message after deleting the booking and updating the ground
//   res.status(200).json({
//     success: true,
//     message: "Booking and slots deleted successfully",
//   });
// });
// const deleteBookingDetailsById = asyncHandler(async (req, res) => {
//   const { booking_id, ground_id } = req.query;
  
//   // Log the query parameters to check if they're correct
//   console.log('Ground ID:', ground_id);
//   console.log('Booking Query:', req.query);

//   // Check if required fields are provided
//   if (!booking_id || !ground_id) {
//     return res.status(400).json({ message: "Please provide booking_id and ground_id" });
//   }

//   // Find the booking to delete using 'book.booking_id' instead of just 'booking_id'
//   const booking = await Booking.findOneAndDelete({
//     "book.booking_id": booking_id, // Access booking_id inside the 'book' object
//     ground_id,
//   });

//   if (!booking) {
//     return res.status(404).json({ message: "Booking not found for the given booking_id and ground_id" });
//   }

//   // Update the Ground's slots to remove the booked slots
//   const ground = await Ground.findOne({ ground_id });

//   if (!ground) {
//     return res.status(404).json({ message: "Ground not found for the given ground_id" });
//   }

//   // Ensure ground.slots is an object
//   if (typeof ground.slots !== 'object') {
//     return res.status(500).json({ message: "Ground slots are not in the correct format" });
//   }

//   // Remove booked slots from the Ground's slot list
//   const updatedSlots = { ...ground.slots };

//   // Ensure booking.slots is an array before proceeding
//   if (!Array.isArray(booking.slots)) {
//     return res.status(500).json({ message: "Booking slots are not in the correct format" });
//   }

//   booking.slots.forEach((slot) => {
//     if (updatedSlots.hasOwnProperty(slot)) {
//       const bookedSlots = updatedSlots[slot].bookedSlots;
//       if (Array.isArray(bookedSlots)) {
//         const index = bookedSlots.indexOf(booking_id);
//         if (index > -1) {
//           bookedSlots.splice(index, 1); // Remove the booking ID from the booked slots
//         }
//       } else {
//         console.log('No bookedSlots array found for slot:', slot);
//       }
//     } else {
//       console.log('Slot not found in updatedSlots:', slot);
//     }
//   });

//   // Save the updated ground with the removed slots
//   await ground.updateOne({
//     $set: { slots: updatedSlots },
//   });

//   // Return success message after deleting the booking and updating the ground
//   res.status(200).json({
//     success: true,
//     message: "Booking and slots deleted successfully",
//   });
// });

// const deleteBookingDetailsById = asyncHandler(async (req, res) => {
//   const { booking_id, ground_id } = req.query;
//   console.log('Ground ID:', ground_id);
//   console.log('Booking Query:', req.query);  // Log the query parameters for debugging

//   // Check if required fields are provided
//   if (!booking_id || !ground_id) {
//     return res.status(400).json({ message: "Please provide booking_id and ground_id" });
//   }

//   // Find the booking to delete using 'book.booking_id' instead of just 'booking_id'
//   const booking = await Booking.findOne({
//     "book.booking_id": booking_id, // Access booking_id inside the 'book' object
//     ground_id,
//   });

//   // If the booking is not found, return an error message
//   if (!booking) {
//     return res.status(404).json({ message: "Booking not found for the given booking_id and ground_id" });
//   }

//   // Proceed with deletion since the booking exists
//   await Booking.findOneAndDelete({
//     "book.booking_id": booking_id,
//     ground_id,
//   });

//   // Update the Ground's slots to remove the booked slots
//   const ground = await Ground.findOne({ ground_id });

//   if (!ground) {
//     return res.status(404).json({ message: "Ground not found for the given ground_id" });
//   }

//   // Ensure ground.slots is an object (in case it's an array of subdocuments, convert to plain object)
//   const updatedSlots = ground.slots.toObject ? ground.slots.toObject() : { ...ground.slots };

//   // Remove booked slots from the Ground's slot list
//   booking.slots.forEach((slot) => {
//     if (updatedSlots.hasOwnProperty(slot)) {
//       const bookedSlots = updatedSlots[slot].bookedSlots;
//       if (Array.isArray(bookedSlots)) {
//         const index = bookedSlots.indexOf(booking_id);
//         if (index > -1) {
//           bookedSlots.splice(index, 1); // Remove the booking ID from the booked slots
//         }
//       } else {
//         console.log('No bookedSlots array found for slot:', slot);
//       }
//     } else {
//       console.log('Slot not found in updatedSlots:', slot);
//     }
//   });

//   // Mark the 'slots' field as modified and save the updated ground document
//   ground.markModified('slots');
//   await ground.save(); // Save the updated ground document

//   // Return success message after deleting the booking and updating the ground
//   res.status(200).json({
//     success: true,
//     message: "Booking and slots deleted successfully",
//   });
// });
// const deleteBookingDetailsById = asyncHandler(async (req, res) => {
//   const { booking_id, ground_id } = req.query;
//   console.log('Ground ID:', ground_id);
//   console.log('Booking Query:', req.query);  // Log the query parameters for debugging

//   // Check if required fields are provided
//   if (!booking_id || !ground_id) {
//     return res.status(400).json({ message: "Please provide booking_id and ground_id" });
//   }

//   // Find the booking to delete using 'book.booking_id' instead of just 'booking_id'
//   const booking = await Booking.findOne({
//     "book.booking_id": booking_id, // Access booking_id inside the 'book' object
//     ground_id,
//   });

//   // If the booking is not found, return an error message
//   if (!booking) {
//     return res.status(404).json({ message: "Booking not found for the given booking_id and ground_id" });
//   }

//   // Proceed with deletion since the booking exists
//   await Booking.findOneAndDelete({
//     "book.booking_id": booking_id,
//     ground_id,
//   });

//   // Update the Ground's slots to remove the booked slots
//   const ground = await Ground.findOne({ ground_id });

//   if (!ground) {
//     return res.status(404).json({ message: "Ground not found for the given ground_id" });
//   }
//  // Log the booking date and ground slots for debugging
//  console.log('Booking Date:', booking.date); // Log the booking date
//  console.log('Ground Slots:', ground.slots); // Log all available slots
//   // Ensure the slots field is a map, and access the correct date in the slots map
//   const dateKey = Object.keys(ground.slots).find(date => date === booking.date); // Assuming booking.date is the date the slot was booked
//   console.log(dateKey , 'dateKey');
//   if (dateKey && ground.slots[dateKey]) {
//     const bookedSlots = ground.slots[dateKey].bookedSlots;
//     console.log(bookedSlots, 'booked slots in groundschema')
//     // Remove the booking ID from the bookedSlots array
//     const index = bookedSlots.indexOf(booking_id);
//     console.log(index, 'index of ground schema');
//     if (index > -1) {
//       bookedSlots.splice(index, 1); // Remove the booking ID from the booked slots
//     }

//     // Mark the slots as modified
//     ground.markModified(`slots.${dateKey}`);
//     await ground.save(); // Save the updated ground document
//   } else {
//     return res.status(400).json({ message: "No booked slots found for the given date in the ground" });
//   }

//   // Return success message after deleting the booking and updating the ground
//   res.status(200).json({
//     success: true,
//     message: "Booking and slots deleted successfully",
//   });
// });
// const deleteBookingDetailsById = asyncHandler(async (req, res) => {
//   const { booking_id, ground_id } = req.query;
//   console.log('Ground ID:', ground_id);
//   console.log('Booking Query:', req.query);  // Debugging log

//   if (!booking_id || !ground_id) {
//     return res.status(400).json({ message: "Please provide booking_id and ground_id" });
//   }

//   // Find the booking to delete
//   const booking = await Booking.findOne({
//     "book.booking_id": booking_id, 
//     ground_id,
//   });

//   if (!booking) {
//     return res.status(404).json({ message: "Booking not found for the given booking_id and ground_id" });
//   }

//   // Delete the booking record
//   await Booking.findOneAndDelete({ "book.booking_id": booking_id, ground_id });

//   // Find the ground
//   const ground = await Ground.findOne({ ground_id });

//   if (!ground) {
//     return res.status(404).json({ message: "Ground not found for the given ground_id" });
//   }

//   console.log('Booking Date:', booking.date);
//   console.log('Ground Slots:', ground.slots);

//   // Ensure we are looking for the correct date format
//   const dateKey = Object.keys(ground.slots).find(date => date === booking.date);
//   console.log('Date Key:', dateKey);

//   if (dateKey && ground.slots[dateKey]) {
//     const bookedSlots = ground.slots[dateKey].bookedSlots;
//     console.log('Booked Slots Before Deletion:', bookedSlots);

//     // **Find the slot time to remove**
//     const slotTimeToRemove = booking.slot_time;  // Assuming the booked slot time is stored in booking.slot_time

//     // Remove the slot from bookedSlots
//     const index = bookedSlots.indexOf(slotTimeToRemove);
//     console.log('Index of Slot in Array:', index);

//     if (index > -1) {
//       bookedSlots.splice(index, 1);
//     }

//     // **Delete the date if no slots are left (optional)**
//     if (bookedSlots.length === 0) {
//       delete ground.slots[dateKey];  // Remove the date entry if no slots are booked
//     }

//     // Mark as modified and save
//     ground.markModified(`slots.${dateKey}`);
//     await ground.save();
//   } else {
//     return res.status(400).json({ message: "No booked slots found for the given date in the ground" });
//   }

//   res.status(200).json({
//     success: true,
//     message: "Booking and slots deleted successfully",
//   });
// });
const deleteBookingDetailsById = asyncHandler(async (req, res) => {
  const { booking_id, ground_id } = req.query;
  console.log('Ground ID:', ground_id);
  console.log('Booking Query:', req.query);

  if (!booking_id || !ground_id) {
    return res.status(400).json({ message: "Please provide booking_id and ground_id" });
  }

  // Find the booking
  const booking = await Booking.findOne({
    "book.booking_id": booking_id, 
    ground_id,
  });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found for the given booking_id and ground_id" });
  }

  // Delete the booking
  await Booking.findOneAndDelete({ "book.booking_id": booking_id, ground_id });

  // Find the ground
  const ground = await Ground.findOne({ ground_id });

  if (!ground) {
    return res.status(404).json({ message: "Ground not found for the given ground_id" });
  }

  console.log('Booking Date:', booking.date);
  console.log('Ground Slots:', ground.slots);

  // ✅ Correct way to get date key in Mongoose Map
  const slotData = ground.slots.get(booking.date);  // Use `.get()` for Mongoose Map
  console.log('Slot Data for Date:', slotData);

  if (slotData) {
    const bookedSlots = slotData.bookedSlots;
    console.log('Booked Slots Before Deletion:', bookedSlots);

    // ✅ Ensure we are removing the correct slot
    // const slotTimeToRemove = booking.slot_time; // Assuming slot time is stored in booking.slot_time
    // const index = bookedSlots.indexOf(slotTimeToRemove);
    const slotTimeToRemove = booking.slot_time; // Ensure it's a string
    const index = bookedSlots.indexOf(slotTimeToRemove);
    console.log('Index of Slot in Array:', index);

    if (index > -1) {
      bookedSlots.splice(index, 1);
    }

    // ✅ If no booked slots remain, remove the date key
    if (bookedSlots.length === 0) {
      ground.slots.delete(booking.date);
    } else {
      ground.slots.set(booking.date, slotData); // Update Map
    }

    ground.markModified("slots");
    await ground.save();
  } else {
    return res.status(400).json({ message: "No booked slots found for the given date in the ground" });
  }

  res.status(200).json({
    success: true,
    message: "Booking and slots deleted successfully",
  });
});


///update booking price
// const updateBookingPrice = asyncHandler(async (req, res) => {
//   const { booking_id, newPrice, comboPack } = req.body;

//   // Check if required fields are provided
//   if (!booking_id || newPrice === undefined) {
//     return res.status(400).json({ message: "Please provide booking_id and newPrice" });
//   }

//   // Find the booking by booking_id
//   const booking = await Booking.findOne({ 'book.booking_id': booking_id });

//   if (!booking) {
//     return res.status(404).json({ message: "Booking not found" });
//   }

//   // Update the price and combo pack status
//   booking.book.price = newPrice;

//   // If the combo pack was updated, we need to recalculate the total price
//   const pricePerSlot = 800 * 0.5; // Slot duration = 0.5 hours
//   const updatedPrice = booking.slots.length * pricePerSlot + (comboPack ? 80 : 0);

//   booking.book.price = updatedPrice;
//   booking.comboPack = comboPack;

//   // Save the updated booking
//   await booking.save();

//   // Return the updated booking details
//   res.status(200).json({
//     success: true,
//     data: { booking_id, price: updatedPrice, comboPack },
//     message: "Booking price updated successfully",
//   });
// });

const updateBookingPrice = asyncHandler(async (req, res) => {
  const { booking_id, newPrice, comboPack } = req.body;

  // Check if required fields are provided
  if (!booking_id) {
    return res.status(400).json({ message: "Please provide booking_id" });
  }

  // Find the booking by booking_id
  const booking = await Booking.findOne({ "book.booking_id": booking_id });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Calculate price per slot (default logic)
  const pricePerSlot = 800 * 0.5; // Each slot costs 400
  
  let updatedPrice = booking.book.price; // Start with the current price

  // If newPrice is provided, update it
  if (newPrice !== undefined) {
    updatedPrice = newPrice;
  } else {
    // Otherwise, calculate price dynamically based on slots & combo pack
    updatedPrice = booking.slots.length * pricePerSlot + (comboPack ? 80 : 0);
  }

  // Update booking price and combo pack
  booking.book.price = updatedPrice;
  if (comboPack !== undefined) {
    booking.comboPack = comboPack;
  }

  // Save the updated booking
  await booking.save();

  // Return the updated booking details
  res.status(200).json({
    success: true,
    data: { booking_id, price: updatedPrice, comboPack: booking.comboPack },
    message: "Booking price updated successfully",
  });
});


export { bookingGround, getBookings, getBookingDetailsBySlot, deleteBookingDetailsById, updateBookingPrice };



