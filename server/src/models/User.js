import mongoose, { Schema } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';

import constants from '../config/constants';

const UserSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	firstName: String,
	lastName: String,
	avatar: String,
	password: String, 
	email: {
		type: String,
		unique: true
	},
}, { timestamps: true });

// before saving perform the following options
// use function instead of => to user this. var 
UserSchema.pre('save', function(next) {
	// if user modified password
	if (this.isModified('password')) {
		this.password = this._hashPassword(this.password);
		return next();
	}

	return next();
});

UserSchema.methods = {
	_hashPassword(password) {
		return hashSync(password);
	},
	authenticateUser(password) {
		return compareSync(password, this.password);
	},
	createToken() {
		return jwt.sign(
			{
				_id: this._id
			}, 
			constants.JWT_SECRET
		);
	}
}
export default mongoose.model('User', UserSchema);