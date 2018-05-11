import mongoose, { Schema } from 'mongoose';

const GigSchema = new Schema({
  title: {
    type: String, 
    minlength: [3, 'Title needs to be longer'],
    maxlength: [144, 'Title is too long'],
  },
  desc: {
  	type: String,
  	minlength: [50, 'Description needs to be longer'],
  	maxlength: [4000, 'Description is too long'],
  },
  user: {
  	type: Schema.Types.ObjectId,
  	ref: 'User'
  },
  favoriteCount: {
  	type: Number,
  	default: 0
  }
}, { timestamps: true });

export default mongoose.model('Gig', GigSchema);
