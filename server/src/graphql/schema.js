export default `
	scalar Date

	type Status {
		message: String!
	}

	type Auth {
		token: String!
	}

	type User {
		_id: ID!
		username: String
		email: String!
		firstName: String
		lastName: String
		createdAt: Date!
		updatedAt: Date!
	}

	type Me {
		_id: ID!
		username: String
		email: String!
		firstName: String
		lastName: String
		createdAt: Date!
		updatedAt: Date!
	}

	type Tweet {
		_id: ID!
		text: String!
		user: User!
		favoriteCount: Int!
		createdAt: Date!
		updatedAt: Date!
	}
	
	type Post {
		_id: ID!
		text: String!
		user: User!
		favoriteCount: Int!
		createdAt: Date!
		updatedAt: Date!
	}

	type Query {
		getTweet(_id: ID!): Tweet
		getTweets: [Tweet]
		getUserTweets: [Tweet]
		getPost(_id: ID!): Post
		getPosts: [Post]
		getUserPosts: [Post]
		me: Me
	}

	type Mutation {
		createTweet(text: String!): Tweet
		updateTweet(_id: ID!, text: String): Tweet
		deleteTweet(_id: ID!): Status
		createPost(text: String!): Post
		updatePost(_id: ID!, text: String): Post
		deletePost(_id: ID!): Status
		signup(email: String!, fullName: String!, password: String!, avatar: String, username: String): Auth
		login(email: String!, password: String!): Auth
	}

	schema {
		query: Query
		mutation: Mutation
	}
`;
