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

function createPost(parent, { title, text, pictureURL }, context, info) {
  const userId = getUserId(context)
  return context.db.mutation.createPost(
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
  // channel ID, user ID, toUser ID, text 
  const userId = getUserId(context)
  const { id, text } = args 
  var channel

  // check if there's already a message existing btw two users
  const messages = await context.db.query.messages({ where: { toUserId: id } }, info)
  console.log("messages ", messages)
  if (messages.length > 0) {
    console.log("yes, eists!")
    channel = messages[0].channel
    console.log(messages[0].channel)
  } else {
    console.log("No, doesn't exists")
    channel = await context.db.mutation.createChannel({
      data: {
        users: { connect: [{ id: id }, { id: userId }] },
      }
    }, info)
    console.log(channel)
  }
  
  return context.db.mutation.createMessage({ 
    data: { 
      toUserId: id,
      from: { connect: { id: userId } }, 
      text: text,
      channel: { connect: { id: channel.id } },
    } 
  }, info)
}

function deleteMessage(parent, { id }, ctx, info) {
  return ctx.db.mutation.deleteMessage({ where: { id } }, info)
}

function deleteChannel(parent, { id }, ctx, info) {
  return ctx.db.mutation.deleteChannel({ where: { id } }, info)
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
  deleteMessage,
  deleteChannel,
}