import Gig from '../../models/Gig';
import { requireAuth } from '../../services/auth';

export default {
  /* find everything from mongoDB connection Tweet*/
  // getTweet: (_, args) => Tweet.findById(args._id),
  getGig: async (_, { _id }, { user }) => {
  	try {
			await requireAuth(user);
			return Gig.findById(_id);
  	} catch (error) {
  		throw error;
  	}
  },
  getGigs: async (_, args, { user }) => {
  	try {
  		// await requireAuth(user);
			return Gig.find({}).sort({ createdAt: -1 });
  	} catch (error) {
  		throw error;
  	}
  },
  getUserGigs: async (_, args, { user }) => {
		try {
			await requireAuth(user);
			return Gig.find({ user: user._id }).sort({ createdAt: -1 });
		} catch (error) {
			throw error; 
		}
  },
  createGig: async (_, args, { user }) => {
  	try {
			await requireAuth(user);
			// if not spread args, there will be object inside the object
  		return Gig.create({...args, user: user._id});
  	} catch(error) {
  		throw error;
  	}
  },
  // createTweet: async (_, args, ctx) => {
  // 	await requireAuth(ctx.user);
  // 	return Tweet.create(args)
  // },
  updateGig: async (_, { _id, ...rest }, { user }) => {
  	try {
  		await requireAuth(user);
  		// const tweet = Tweet.findByIdAndUpdate(_id, rest, {new: true});
  		const gig = await Gig.findOne({ _id, user: user._id }); 

  		if (!gig) {
  			throw new Error('Not found!');
  		}
			// rest => { text: 'Hello world', favoriteCount: 2 }
  		Object.entries(rest).forEach(([key, value]) => {
				gig[key] = value;
  		});

  		return gig.save();
  	} catch(error) {
  		throw error;
  	}
  },
  deleteGig: async (_, { _id }, { user }) => {
  	try {
  		await requireAuth(user);
			// await Tweet.findByIdAndRemove(_id);
			const gig = await Gig.findOne({_id, user: user._id});

			if (!gig) {
				throw new Error('Not found!');
			}
			await gig.remove(); 

			return {
				message: 'Delete Success!'
			}
  	} catch (error) {
  		throw error;
  	}
  }
};
