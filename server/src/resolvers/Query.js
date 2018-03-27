const { getUserId } = require('../utils')

function postFeed(parent, args, ctx, info) {
  return ctx.db.query.posts({ where: {} }, info)
}

function postsConnection(parent, args, ctx, info) {
  const { first, after, orderBy } = args
  return ctx.db.query.postsConnection({ after, first, orderBy }, info)
}

function post(parent, { id }, ctx, info) {
  return ctx.db.query.post({ where: { id } }, info)
}

function usersConnection(parent, args, ctx, info) {
  const { first, after, orderBy } = args
  return ctx.db.query.usersConnection({ after, first, orderBy }, info)
}

function user(parent, { id }, context, info) {
  return context.db.query.user({where: { id } }, info)
}

function me(parent, args, context, info) {
  const userId = getUserId(context)
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
    { AND: [{ toUserId: id }, { from: { id: userId } }] },
    { AND: [{ toUserId: userId }, { from: { id: id } }] },
  ]}
  
  return context.db.query.messages({ where }, info)
}

function messagesConnection(parent, args, context, info) {
  const { first, after, orderBy, id, channelId } = args
  const userId = getUserId(context)

  const where = { OR: [
    { AND: [{ toUserId: id }, { from: { id: userId } }] },
    { AND: [{ toUserId: userId }, { from: { id: id } }] },
  ]}
  
  return context.db.query.messagesConnection({ after, first, orderBy, where }, info)
}


function channels(parent, args, context, info) {
  return context.db.query.channels({ where: {} }, info)
}

module.exports = {
	postFeed,
  postsConnection,
	post,
	users,
  usersConnection,
	user,
  me,
  channels,
  channelsConnection,
  messages,
  messagesConnection,
}