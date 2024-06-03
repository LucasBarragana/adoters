import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  lastName: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  donations: {
    type: [String],  // Array de strings para itens de doação
  },
  help: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  openingHours: [{
    day: String,
    openingTime: String,
    closingTime: String,
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
  }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
