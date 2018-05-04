import GraphQLDate from 'graphql-date';

import TweetResolvers from './tweet-resolvers';
import UserResolvers from './user-resolvers';
import PostResolvers from './post-resolvers';
import User from '../../models/User';

export default {
	Date: GraphQLDate,
	Tweet: {
		// parent.user <= parent is the object Tweet
		user: ({ user }) => User.findById(user),
	},
  Query: {
  	getTweet: TweetResolvers.getTweet,
    getTweets: TweetResolvers.getTweets,
    getUserTweets: TweetResolvers.getUserTweets,
    getPost: PostResolvers.getPost,
    getPosts: PostResolvers.getPosts,
    getUserPosts: PostResolvers.getUserPosts,
    me: UserResolvers.me,
  },
  Mutation: {
  	createTweet: TweetResolvers.createTweet,
  	updateTweet: TweetResolvers.updateTweet,
  	deleteTweet: TweetResolvers.deleteTweet,
    createPost: PostResolvers.createPost,
    updatePost: PostResolvers.updatePost,
    deletePost: PostResolvers.deletePost,
  	signup: UserResolvers.signup,
  	login: UserResolvers.login
  }
};
