import {model, models, Schema} from "mongoose";

const UserInfoSchema = new Schema({
  name:{type: String, required: true},
  email: {type: String, required: true},
  streetAddress: {type: String, required: true},
  numberAddress: {type: String, required: true},
  postalCode: {type: String},
  city: {type: String, required: true},
  phone: {type: String, required: true},
  admin: {type: Boolean, default: false},
}, {timestamps: true});

export const UserInfo = models?.UserInfo || model('UserInfo', UserInfoSchema);