function postFeed(parent, args, ctx, info) {
  return ctx.db.query.posts({ where: {} }, info)
}

function postsConnection(parent, args, ctx, info) {
  return ctx.db.query.postsConnection({ where: {}, ...args }, info)
}

function post(parent, { id }, ctx, info) {
  return ctx.db.query.post({ where: { id } }, info)
}

function user(parent, { userId }, context, info) {
  return context.db.query.user({where: { id: userId } }, info)
}

function users(parent, args, context, info) {
  const { filter, first, skip } = args // destructure input arguments
  const where = filter
    ? { OR: [{ firstName_contains: filter }, { lastName_contains: filter }] }
    : {}

  return context.db.query.users({ first, skip, where }, info)
}

function channels(parent, args, context, info) {
  return context.db.query.channels({ where: {} }, info)
}

module.exports = {
	postFeed,
  postsConnection,
	post,
	users,
	user,
  channels,
}