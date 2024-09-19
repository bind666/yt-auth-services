import { model, Schema } from 'mongoose';
import { User } from '../types';

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    devices: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const User = model<User>('User', userSchema);

export default User;
