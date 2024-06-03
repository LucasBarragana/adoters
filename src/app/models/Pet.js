import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  creatorEmail: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,}
});

export default mongoose.models.Pet || mongoose.model("Pet", PetSchema);
