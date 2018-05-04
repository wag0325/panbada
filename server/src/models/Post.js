import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  text: {
  	type: String,
  	minlength: [5, 'Text need to be longer'],
  	maxlength: [600, 'Text too long'],
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

export default mongoose.model('Post', PostSchema);
