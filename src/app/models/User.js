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
  },
  postalCode: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  city: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
  }],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
