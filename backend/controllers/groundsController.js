import asynHandler from '../middleware/asyncHandler.js';
import Ground from '../models/Ground.js';
import Booking from '../models/Booking.js';



// const createGround = asynHandler(async (req, res) => {
//     const { name, location, city, country, state, stateDistrict, description } = req.body;

//     // Log request body and file for debugging
//     console.log('Request Body:', req.body);
//     console.log('Uploaded File:', req.file);

//     // Validate file
//     if (!req.file) {
//         return res.status(400).json({ message: 'Photo file is required' });
//     }
//    // const photo = req.file ? req.file.filename : null;
//     const photo = req.files.map(file => file.path);
//     // Log file information
//     console.log('File received:', req.file);

//     // Ensure the file exists in the request
//     if (!req.file) {
//         return res.status(400).json({ message: 'File is required' });
//     }

//     // Validate required fields, including city, state, and district
//     if (!name || !location || !city || !country || !state || !stateDistrict || !description) {
//         res.status(404);
//         throw new Error(
//             'All fields (name, location, city, country, state, stateDistrict, description) are required'
//         );
//     }

//     try {
//         // Create a new ground document with all the required fields
//         const newGround = new Ground({
//             name,
//             location,
//             city,         // Save the city
//             country,
//             state,         // Save the state
//             stateDistrict, // Save the state district
//             photo: photo,
//             description,
//         });

//         // Save the new ground document to the database
//         await newGround.save();

//         // Respond with the newly created ground data
//         res.status(201).json({
//             message: 'Ground created successfully',
//             ground: {
//                 ground_id: newGround.ground_id,
//                 name: newGround.name,
//                 location: newGround.location,
//                 city: newGround.city,       // Include city in the response
//                 country: newGround.country,
//                 state: newGround.state,     // Include state in the response
//                 stateDistrict: newGround.stateDistrict, // Include state district in the response
//                 photo: newGround.photo,
//                 description: newGround.description,
//             },
//         });
//     } catch (error) {
//         console.error('Error creating ground:', error);
//         res.status(500);
//         throw new Error('SERVER ERROR');
//     }
// });
// const createGround = asynHandler(async (req, res) => {
//     const { name, location, city, country, state, stateDistrict, description } = req.body;
  
//     // Log request body and files for debugging
//     console.log("Request Body:", req.body);
//     console.log("Uploaded Files:", req.files);
  
//     // Validate file(s): Check that req.files exists and has at least one file
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "Photo file is required" });
//     }
  
//     // Map over req.files to get an array of file paths
//     const photoPaths = req.files.map((file) => file.path);
  
//     // Validate required fields, including city, state, and district
//     if (!name || !location || !city || !country || !state || !stateDistrict || !description) {
//       res.status(404);
//       throw new Error(
//         "All fields (name, location, city, country, state, stateDistrict, description) are required"
//       );
//     }
  
//     try {
//       // Create a new ground document with all the required fields
//       const newGround = new Ground({
//         name,
//         location,
//         city,         // Save the city
//         country,
//         state,         // Save the state
//         stateDistrict, // Save the state district
//         photo: photoPaths,
//         description,
//       });
  
//       // Save the new ground document to the database
//       await newGround.save();
  
//       // Respond with the newly created ground data
//       res.status(201).json({
//         message: "Ground created successfully",
//         ground: {
//           ground_id: newGround.ground_id,
//           name: newGround.name,
//           location: newGround.location,
//           city: newGround.city,       // Include city in the response
//           country: newGround.country,
//           state: newGround.state,     // Include state in the response
//           stateDistrict: newGround.stateDistrict, // Include state district in the response
//           photo: newGround.photo,
//           description: newGround.description,
//         },
//       });
//     } catch (error) {
//       console.error("Error creating ground:", error);
//       res.status(500);
//       throw new Error("SERVER ERROR");
//     }
//   });
// const createGround = asynHandler(async (req, res) => {
//     const { name, location, city, country, state, stateDistrict, description } = req.body;
  
//     // Log request body and files for debugging
//     console.log("Request Body:", req.body);
//     console.log("Uploaded Files:", req.files);
  
//     // Validate file(s)
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "Photo file is required" });
//     }
  
//     // Map over req.files to get an array of file paths
//     const photoPaths = req.files.map((file) => file.path);
  
//     // Validate required fields
//     if (!name || !location || !city || !country || !state || !stateDistrict || !description) {
//       res.status(404);
//       throw new Error(
//         "All fields (name, location, city, country, state, stateDistrict, description) are required"
//       );
//     }
  
//     try {
//       // Create a new ground document with all the required fields
//       const newGround = new Ground({
//         name,
//         location,
//         city,
//         country,
//         state,
//         stateDistrict,
//         photo: photoPaths,
//         description,
//       });
  
//       // Save the new ground document to the database
//       await newGround.save();
  
//       // Respond with the newly created ground data
//       res.status(201).json({
//         message: "Ground created successfully",
//         ground: {
//           ground_id: newGround.ground_id,
//           name: newGround.name,
//           location: newGround.location,
//           city: newGround.city,
//           country: newGround.country,
//           state: newGround.state,
//           stateDistrict: newGround.stateDistrict,
//           photo: newGround.photo,
//           description: newGround.description,
//         },
//       });
//     } catch (error) {
//       console.error("Error creating ground:", error);
//       res.status(500).json({ message: "SERVER ERROR", error: error.message });
//     }
//   });
const createGround = asynHandler(async (req, res) => {
    const { name, location, city, country, state, stateDistrict, description } = req.body;
  
    // Log request body and files for debugging
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);
  
    // Validate that at least one file was uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Photo file is required" });
    }
  
    // Map over req.files to get an array of file paths
    const photoPaths = req.files.map((file) => file.filename);
  
    // Validate required fields
    if (!name || !location || !city || !country || !state || !stateDistrict || !description) {
      res.status(404);
      throw new Error(
        "All fields (name, location, city, country, state, stateDistrict, description) are required"
      );
    }
  
    try {
      // Create a new ground document with the required fields
      const newGround = new Ground({
        name,
        location,
        city,
        country,
        state,
        stateDistrict,
        photo: photoPaths, // Store an array of photo paths
        description,
      });
  
      // Save the new ground document to the database
      await newGround.save();
  
      // Respond with the newly created ground data
      res.status(201).json({
        message: "Ground created successfully",
        ground: {
          ground_id: newGround.ground_id,
          name: newGround.name,
          location: newGround.location,
          city: newGround.city,
          country: newGround.country,
          state: newGround.state,
          stateDistrict: newGround.stateDistrict,
          photo: newGround.photo,
          description: newGround.description,
        },
      });
    } catch (error) {
      console.error("Error creating ground:", error);
      res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
  });
   
const getGroundsByLocation = asynHandler(async (req, res) => {
    try {
        const { location, state, city } = req.query; // Get query parameters

        // Validate the `state` parameter
        if (!state || state.trim() === '') {
            return res.status(400).json({ message: "Please select a valid state" });
        }

        // Build query object dynamically based on provided filters
        const query = {};
        if (location) query.location = { $regex: new RegExp(location, "i") }; // Case-insensitive regex for location
        if (state) query.state = { $regex: new RegExp(state, "i") }; // Case-insensitive regex for state
        if (city) query.city = { $regex: new RegExp(city, "i") }; // Case-insensitive regex for city

        // Fetch grounds based on the query
        const grounds = await Ground.find(query);

        // Handle cases where no grounds are found
        if (!grounds || grounds.length === 0) {
            let message = "No grounds found";
            if (state && city) {
                message = "No grounds found for the specified state and city combination";
            } else if (state) {
                message = "No grounds found for the specified state";
            } else if (city) {
                message = "No grounds found for the specified city";
            }
            return res.status(404).json({ message });
        }

        // Format the response
        const response = grounds.map((ground) => ({
            ground_id: ground.ground_id,
            data: {
                name: ground.name,
                location: ground.location,
                city: ground.city,
                photo: ground.photo,
                description: ground.description,
            },
        }));

        // Send the response
        res.status(200).json(response);
    } catch (err) {
        // Catch and send server errors
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

const getGroundsByIdandDate = asynHandler(async(req , res)=>{
     const { ground_id } = req.params;
        const { date } = req.query;
    try {
        // Find the ground
        const ground = await Ground.findOne({ ground_id });
        if (!ground) {
            return res.status(404).json({ message: 'Ground not found.' });
        }

        // Validate and format the date
        const selectedDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        // Find all bookings for the selected date and ground
        const bookings = await Booking.find({ ground_id, date: selectedDate });

        // Aggregate booked slots
        const bookedSlots = bookings.reduce((acc, booking) => acc.concat(booking.slots), []);

        // Respond with ground details and booked slots
        res.status(200).json({
            name: ground.name,
            location: ground.location,
            data: {
                image: ground.photo,
                desc: ground.description,
            },
            slots: {
                booked: bookedSlots,
            },
        });
    } catch (error) {
        console.error('Error fetching ground details:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

export {createGround , getGroundsByLocation , getGroundsByIdandDate};