import Tweet from '../../models/Tweet';
import { requireAuth } from '../../services/auth';

export default {
  /* find everything from mongoDB connection Tweet*/
  // getTweet: (_, args) => Tweet.findById(args._id),
  getTweet: async (_, { _id }, { user }) => {
  	try {
			await requireAuth(user);
			return Tweet.findById(_id);
  	} catch (error) {
  		throw error;
  	}
  },
  getTweets: async (_, args, { user }) => {
  	try {
  		// await requireAuth(user);
			return Tweet.find({}).sort({ createdAt: -1 });
  	} catch (error) {
  		throw error;
  	}
  },
  getUserTweets: async (_, args, { user }) => {
		try {
			await requireAuth(user);
			return Tweet.find({ user: user._id }).sort({ createdAt: -1 });
		} catch (error) {
			throw error; 
		}
  },
  createTweet: async (_, args, { user }) => {
  	try {
			await requireAuth(user);
			// if not spread args, there will be object inside the object
  		return Tweet.create({...args, user: user._id});
  	} catch(error) {
  		throw error;
  	}
  },
  // createTweet: async (_, args, ctx) => {
  // 	await requireAuth(ctx.user);
  // 	return Tweet.create(args)
  // },
  updateTweet: async (_, { _id, ...rest }, { user }) => {
  	try {
  		await requireAuth(user);
  		// const tweet = Tweet.findByIdAndUpdate(_id, rest, {new: true});
  		const tweet = await Tweet.findOne({ _id, user: user._id }); 

  		if (!tweet) {
  			throw new Error('Not found!');
  		}
			// rest => { text: 'Hello world', favoriteCount: 2 }
  		Object.entries(rest).forEach(([key, value]) => {
				tweet[key] = value;
  		});

  		return tweet.save();
  	} catch(error) {
  		throw error;
  	}
  },
  deleteTweet: async (_, { _id }, { user }) => {
  	try {
  		await requireAuth(user);
			// await Tweet.findByIdAndRemove(_id);
			const tweet = await Tweet.findOne({_id, user: user._id});

			if (!tweet) {
				throw new Error('Not found!');
			}
			await tweet.remove(); 

			return {
				message: 'Delete Success!'
			}
  	} catch (error) {
  		throw error;
  	}
  }
};
