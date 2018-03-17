function createPost(parent, { title, text, pictureURL }, ctx, info) {
  return ctx.db.mutation.createPost(
    {
      data: {
        title,
        text,
        pictureURL,
      },
    },
    info,
  )
}

function deletePost(parent, { id }, ctx, info) {
  return ctx.db.mutation.deletePost({ where: { id } }, info)
}

module.exports = {
  createPost,
  deletePost,
}