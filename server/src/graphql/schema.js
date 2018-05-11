export default `
	scalar Date
	scalar DateTime 

	enum GIG_TYPE {
	  CREATIVE
	  CREW
	  EVENT
	  LABOR
	  TALENT
	  TECHNICAL
	  WRITING
	  OTHER
	}

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
	
	type Project {
		_id: ID!
		title: String!
		desc: String
		url: String
		gigs: [Gig]
		members: [User]
		postedBy: User
		createdAt: Date!
		updatedAt: Date!
	}

	type Gig {
		_id: ID!
		title: String!
		type: GIG_TYPE!
		desc: String
		url: String
		createdAt: Date!
		updatedAt: Date!
		startDateTime: DateTime
		endDateTime: DateTime
  	location: Location
  	directions: String
  	favoriteCount: Int
  	user: User!
	}
	
	type Location {
	  _id: ID!
	  name: String!
	  lat: Float!
	  lng: Float!
	  address: String!
	}
	
	type Query {
		getTweet(_id: ID!): Tweet
		getTweets: [Tweet]
		getUserTweets: [Tweet]
		getPost(_id: ID!): Post
		getPosts: [Post]
		getUserPosts: [Post]
		getGig(_id: ID!): Gig
		getGigs: [Gig]
		getUserGigs: [Gig]
		me: Me
	}

	type Mutation {
		createTweet(text: String!): Tweet
		updateTweet(_id: ID!, text: String): Tweet
		deleteTweet(_id: ID!): Status
		createPost(text: String!): Post
		updatePost(_id: ID!, text: String): Post
		deletePost(_id: ID!): Status
		createGig(title: String!, desc: String): Gig
		updateGig(_id: ID!, title: String!, desc: String): Gig
		deleteGig(_id: ID!): Status
		signup(email: String!, fullName: String!, password: String!, avatar: String, username: String): Auth
		login(email: String!, password: String!): Auth
	}

	schema {
		query: Query
		mutation: Mutation
	}
`;
