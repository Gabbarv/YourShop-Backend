import mongoose from 'mongoose'
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  wishlist: {
    type: Array,
    default: []
  }
},
{
  timestamps: true,
}
);
const User = mongoose.model('User', usersSchema)

export default User