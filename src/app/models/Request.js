import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
  },
  petName: {
    type: String,
    required: true,
  },
  adopterEmail: {
    type: String,
    required: true,
  },
  creatorEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Em Analise',
  }
});

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);
