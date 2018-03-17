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

module.exports = {
  createPost,
  deletePost,
  signup,
  login,
  follow,
  signS3,
}