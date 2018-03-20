const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

const s3Bucket = process.env.S3_BUCKET
const AWSAccessKeyId = process.env.S3_ACCESS_KEY_ID;
const AWSSecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;﻿

function signS3(parent, { filename, filetype }, context, info) {
  const userId = getUserId(context)
  
  const s3 = new aws.S3({
        signatureVersion: 'v4',
        region: 'us-east-2',
        accessKeyId: AWSAccessKeyId,
        secretAccessKey: AWSSecretAccessKey,
      })

  // s3.createBucket({Bucket: s3Bucket}, function(err, data) {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     params = {Bucket: s3Bucket, Key: filename, Body: 'Hello!'};

  //     s3.putObject(params, function(err, data) {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         console.log("Successfully uploaded data to panbada/filename")
  //       }
  //     })      
  //   }
  // })

  const s3Params = {
    Bucket: s3Bucket,
    Key: filename,
    Expires: 60,
    ContentType: filetype,
    ACL: 'public-read',
  }

  const signedRequest = s3.getSignedUrl('putObject', s3Params)

  const url = `https://${s3Bucket}.s3.amazonaws.com/${filename}`;
  
  console.log("signedRequest " + signedRequest )
  console.log("url " + url)

  return {
    signedRequest,
    url,
  }
}

function createPost(parent, { title, text, pictureURL }, ctx, info) {
  const userId = getUserId(context)
  return ctx.db.mutation.createPost(
    {
      data: {
        title,
        text,
        pictureURL,
        postedBy: { connect: { id: userId } },
      },
    },
    info,
  )
}

function deletePost(parent, { id }, ctx, info) {
  return ctx.db.mutation.deletePost({ where: { id } }, info)
}

function createPostComment(parent, args, context, info) {
  const userId = getUserId(context)
  const { id, text } = args

  return context.db.mutation.createPostComment(
    {
      data: {
        text,
        user: { connect: { id: userId } },
        post: { connect: { id: id } },
      },
    },
    info,
  )
}

function deletePostComment(parent, { id }, context, info) {
  const userId = getUserId(context)

  return context.db.mutation.deletePostComment({ where: { id: id } }, info,)
}

function createGig(parent, { title, text, type }, context, info) {
  const userId = getUserId(context)
  return context.db.mutation.createGig(
    { data: { title, text, type, postedBy: { connect: { id: userId } } } },
    info,
  )
}

function deleteGig(parent, { id }, context, info) {
  const userId = getUserId(context)

  return context.db.mutation.deleteGig({ where: { id: id } }, info,)
}

function createMessage(parent, { id, text }, context, info ) {
  const userId = getUserId(context)

  return context.db.mutation.createMessage(
    { data: {
        from: { connect: { id: userId } },
        to: { connect: { id: id } },
      }
    },
    info
  )
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.db.mutation.createUser({
    data: { ...args, password },
  })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  const user = await context.db.query.user({ where: { email: args.email } })
  if (!user) {
    throw new Error(`Could not find user with email: ${args.email}`)
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

function follow(parent, { id }, context, info) {
  const userId = getUserId(context)
  
  // add a user to my follows 
  return context.db.mutation.updateUser({
    data: { 
      follows: {
        connect: [{ id: id}]
      }
    },
    where: { id: userId },
  }, info)

  // update following user's followers
}

async function createMessage(parent, args, context, info) {
  const userId = getUserId(context)
  const { id, text } = args 

  const channel = await context.db.query.channel({ where: { id: id } })
  if (!channel) {
    throw new Error(`Could not find conversation: ${args.channel}`)
  }
  
  return context.db.mutation.createMessage({ 
    data: { 
      to: { connect: { id: id }  },
      from: { connect: { id: userId } }, 
      text: text
    } 
  }, info)
}

function createChannel(parent, { id, text }, context, info ) {
  const userId = getUserId(context)
  console.log(id)
  console.log(text)
  console.log(userId)

  return context.db.mutation.createChannel({
    data: {
      users: { connect: [{ id: id }, { id: userId }] },
      messages: {
        create: [{ 
          text: text, 
          from: { connect: { id: userId }},
        }] 
      },
    }
  }, info)
}

module.exports = {
  createPost,
  deletePost,
  createPostComment,
  deletePostComment,
  createGig,
  deleteGig,
  createMessage,
  signup,
  login,
  follow,
  signS3,
  createMessage,
  createChannel,
}