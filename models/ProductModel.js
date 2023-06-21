import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
    {
      timestamps: true,
    }
  )
const productSchema = new mongoose.Schema({
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User',
    //   },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  img: {
    type: Array,
    default: [],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    
  },
  color: {
    type: String,
    
  },
  price: {
    type: Number,
    required: true,
  },
  availableQty: {
    type: Number,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  }

});
const Product = mongoose.model('Product', productSchema)

export default Product