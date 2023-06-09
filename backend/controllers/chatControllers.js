const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

//access/create a personal chat with other user
// const accessChat = asyncHandler(async (req, res) => {
//   //id of the other user
//   const { secondUser } = req.body

//   if (!secondUser) {
//     console.log('secondUser param not sent with request')
//     return res.sendStatus(400)
//   }

//   let isPersonalChat = await Chat.find({
//     isGroupChat: false,
//     /////////////////////////////////can try to change this to $or later to be able to text yourself
//     $and: [
//       { users: { $elemMatch: { $eq: req.user._id } } }, //id of logged in user
//       { users: { $elemMatch: { $eq: secondUser._id } } }, //id of another user
//     ],
//   })
//     .populate('users', '-password')
//     .populate('latestMessage')

//   // .populate() gets the data from a database and assigns it to a variable
//   isPersonalChat = await User.populate(isPersonalChat, {
//     path: 'latestMessage.sender',
//     select: 'name picture email',
//   })

//   if (isPersonalChat.length > 0) {
//     res.send(isPersonalChat[0])
//   } else {
//     const chatData = {
//       chatName: secondUser.name,
//       isGroupChat: false,
//       users: [req.user._id, secondUser._id],
//     }

//     try {
//       const createdChat = await Chat.create(chatData)

//       const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password')
//       res.status(200).send(fullChat)
//     } catch (error) {
//       res.status(400)
//       throw new Error(error.message)
//     }
//   }
// })

const accessChat = asyncHandler(async (req, res) => {
  //id of the other user
  const { userId } = req.body

  if (!userId) {
    console.log('UserId param not sent with request')
    return res.sendStatus(400)
  }

  let isPersonalChat = await Chat.find({
    isGroupChat: false,
    /////////////////////////////////can try to change this to $or later to be able to text yourself
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, //id of logged in user
      { users: { $elemMatch: { $eq: userId } } }, //id of another user
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage')

  // .populate() gets the data from a database and assigns it to a variable
  isPersonalChat = await User.populate(isPersonalChat, {
    path: 'latestMessage.sender',
    select: 'name picture email',
  })

  if (isPersonalChat.length > 0) {
    res.send(isPersonalChat[0])
  } else {
    const chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    }

    try {
      const createdChat = await Chat.create(chatData)

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password')
      res.status(200).send(fullChat)
    } catch (error) {
      res.status(400)
      throw new Error(error.message)
    }
  }
})

const fetchChats = asyncHandler(async (req, res) => {
  try {
    //searches through all chats in database and finds chats that countain the id of logged in user
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: 'latestMessage.sender',
          select: 'name picture email',
        })

        res.status(200).send(result)
      })
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    return res.status(400).send({ message: 'One or multiple parameters are missing' })
  }

  //get user array from the body of post reqest
  let users = JSON.parse(req.body.users)

  if (users.length < 2) {
    return res.status(400).send('More than two users are needed to create a group chat')
  }

  //automatically add user when they create a group chat
  users.push(req.user)

  try {
    const groupChat = await Chat.create({
      chatName: req.body.chatName,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    })

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')

    res.status(200).json(fullGroupChat)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')

  if (!updatedChat) {
    res.status(404)
    throw new Error('Chat not found')
  } else {
    res.json(updatedChat)
  }
})

const addToGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')

  if (!added) {
    res.status(404)
    throw new Error('User not found')
  } else {
    res.json(added)
  }
})

const removeFromGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')

  if (!removed) {
    res.status(404)
    throw new Error('User not found')
  } else {
    res.json(removed)
  }
})

const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body

  const deleted = await Chat.findByIdAndDelete(chatId)

  if (!deleted) {
    res.status(404).json({ message: 'Chat not found' })
  } else {
    res.json({ message: 'Chat deleted successfully' })
  }
})

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroupChat,
  removeFromGroupChat,
  deleteChat,
}
