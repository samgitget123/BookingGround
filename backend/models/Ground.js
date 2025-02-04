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
      type: [String], // Changed from String to array of Strings
      required: true,
    },
    created_at: { 
      type: Date, 
      default: Date.now 
    },
    slots: { 
      type: Map, 
      of: { bookedSlots: [String], default: [] } 
    },
    ground_owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
    
  }, { timestamps: true });
  
  const Ground = mongoose.model('Ground', groundSchema);
  export default Ground;
  