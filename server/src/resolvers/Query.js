const { getUserId } = require('../utils')

function postFeed(parent, args, ctx, info) {
  return ctx.db.query.posts({ where: {} }, info)
}

function postsConnection(parent, args, context, info) {
  const { first, after, orderBy, filter } = args
  
  // filter only by postedBy user ID
  const where = filter
    ? { postedBy: { id: filter }}
    : {}

  return context.db.query.postsConnection({ after, first, orderBy, where }, info)
}

function post(parent, { id }, context, info) {
  return context.db.query.post({ where: { id } }, info)
}

function gigsConnection(parent, args, context, info) {
  const { first, after, orderBy } = args
  return context.db.query.gigsConnection({ after, first, orderBy }, info)
}

function gig(parent, { id }, context, info) {
  return context.db.query.gig({ where: { id } }, info)
}

function usersConnection(parent, args, ctx, info) {
  const { first, after, orderBy, filter } = args
  const filters = []

  if (filter) {
    filter.split(' ').map(filter => {
    if (!filter) { return true }
    filters.push({ firstName_contains: filter }, { lastName_contains: filter })})
  }
  
  const where = filter
    ? { OR: filters }
    : {}
    
  return ctx.db.query.usersConnection({ after, first, orderBy, where }, info)
}

function user(parent, { id }, context, info) {
  return context.db.query.user({where: { id } }, info)
}

function me(parent, args, context, info) {
  const userId = getUserId(context)
  
  if (!userId) {
    throw new Error(`No user ${userId}`)
  }

  return context.db.query.user({where: { id: userId } }, info)
}

function users(parent, args, context, info) {
  const { filter, first, skip } = args // destructure input arguments
  const where = filter
    ? { OR: [{ firstName_contains: filter }, { lastName_contains: filter }] }
    : {}

  return context.db.query.users({ first, skip, where }, info)
}

function channelsConnection(parent, args, context, info) {
  const { first, after, orderBy, id } = args
  const userId = getUserId(context)

  const where =  id 
    ? { AND: [{ users_some: { id: userId } }, { users_some: { id } }]}
    : { users_some: { id: userId } }
    
  return context.db.query.channelsConnection({ after, first, orderBy, where }, info)
}

function messages(parent, args, context, info) {
  const { id } = args
  const userId = getUserId(context)

  const where = { OR: [
    { AND: [{ to: { id } }, { from: { id: userId } }] },
    { AND: [{ to: { id: userId } }, { from: { id: id } }] },
  ]}
  
  return context.db.query.messages({ where }, info)
}

function messagesConnection(parent, args, context, info) {
  const { last, before, orderBy, id, channelId } = args
  const userId = getUserId(context)

  const where = { OR: [
    { AND: [{ to: { id } }, { from: { id: userId } }] },
    { AND: [{ to: {id: userId } }, { from: { id: id } }] },
  ]}
  
  return context.db.query.messagesConnection({ before, last, orderBy, where }, info)
}


function channels(parent, args, context, info) {
  return context.db.query.channels({ where: {} }, info)
}

module.exports = {
	postFeed,
  postsConnection,
	post,
  gigsConnection,
  gig,
	users,
  usersConnection,
	user,
  me,
  channels,
  channelsConnection,
  messages,
  messagesConnection,
}