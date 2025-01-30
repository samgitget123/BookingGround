import mongoose from 'mongoose';
const groundSchema = new mongoose.Schema({
    ground_id: {
      type: String,
      required: true,
      unique: true,
      default: () => 'GND' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: { 
      type: String,
      required: true, 
    },
    stateDistrict: {
      type: String,
      required: false,  
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String, // Store the file path
    },
    created_at: { 
      type: Date, 
      default: Date.now 
    },
    slots: { 
      type: Map, 
      of: { bookedSlots: [String], default: [] } 
    },
  }, { timestamps: true });
  
  const Ground = mongoose.model('Ground', groundSchema);
  export default Ground;
  