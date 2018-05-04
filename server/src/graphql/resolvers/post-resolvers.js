import Post from '../../models/Post';
import { requireAuth } from '../../services/auth';

export default {
  /* find everything from mongoDB connection Tweet*/
  // getTweet: (_, args) => Tweet.findById(args._id),
  getPost: async (_, { _id }, { user }) => {
  	try {
			await requireAuth(user);
			return Post.findById(_id);
  	} catch (error) {
  		throw error;
  	}
  },
  getPosts: async (_, args, { user }) => {
    try {
      return Post.find().sort({createdAt:-1});
    } catch (error) {
      throw error;
    }
  },
  getUserPosts: async (_, args, { user }) => {
		try {
			await requireAuth(user);
			return Post.find({ user: user._id }).sort({ createdAt: -1 });
		} catch (error) {
			throw error; 
		}
  },
  createPost: async (_, args, { user }) => {
  	try {
			await requireAuth(user);
			// if not spread args, there will be object inside the object
  		return Post.create({...args, user: user._id});
  	} catch(error) {
  		throw error;
  	}
  },
  // createTweet: async (_, args, ctx) => {
  // 	await requireAuth(ctx.user);
  // 	return Tweet.create(args)
  // },
  updatePost: async (_, { _id, ...rest }, { user }) => {
  	try {
  		await requireAuth(user);
  		// const tweet = Tweet.findByIdAndUpdate(_id, rest, {new: true});
  		const post = await Post.findOne({ _id, user: user._id }); 

  		if (!post) {
  			throw new Error('Not found!');
  		}
			// rest => { text: 'Hello world', favoriteCount: 2 }
  		Object.entries(rest).forEach(([key, value]) => {
				post[key] = value;
  		});

  		return post.save();
  	} catch(error) {
  		throw error;
  	}
  },
  deletePost: async (_, { _id }, { user }) => {
  	try {
  		await requireAuth(user);
			// await Tweet.findByIdAndRemove(_id);
			const post = await Post.findOne({_id, user: user._id});

			if (!post) {
				throw new Error('Not found!');
			}
			await post.remove(); 

			return {
				message: 'Delete Success!'
			}
  	} catch (error) {
  		throw error;
  	}
  }
};
