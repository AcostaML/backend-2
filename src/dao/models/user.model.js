import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name:  { type: String, required: true },
    email:      { type: String, required: true, unique: true, index: true },
    age:        { type: Number, required: true },
    password:   { type: String, required: true }, // hash
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carts',
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'premium'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model(userCollection, userSchema);
