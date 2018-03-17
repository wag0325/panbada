function postFeed(parent, args, ctx, info) {
  return ctx.db.query.posts({ where: {} }, info)
}

function post(parent, { id }, ctx, info) {
  return ctx.db.query.post({ where: { id } }, info)
}

module.exports = {
	postFeed,
	post,
}