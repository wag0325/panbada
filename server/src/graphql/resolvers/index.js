import GraphQLDate from 'graphql-date';

import TweetResolvers from './tweet-resolvers';
import UserResolvers from './user-resolvers';
import PostResolvers from './post-resolvers';
import GigResolvers from './gig-resolvers';
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
    getGigs: GigResolvers.getGigs,
    me: UserResolvers.me,
  },
  Mutation: {
  	createTweet: TweetResolvers.createTweet,
  	updateTweet: TweetResolvers.updateTweet,
  	deleteTweet: TweetResolvers.deleteTweet,
    createPost: PostResolvers.createPost,
    updatePost: PostResolvers.updatePost,
    deletePost: PostResolvers.deletePost,
    createGig: GigResolvers.createGig,
    updateGig: GigResolvers.updateGig,
    deleteGig: GigResolvers.deleteGig,
  	signup: UserResolvers.signup,
  	login: UserResolvers.login
  }
};
