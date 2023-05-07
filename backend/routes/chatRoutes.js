const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const { accessChat, fetchChats, createGroupChat } = require('../controllers/chatControllers')

const router = express.Router()

router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route('/group').post(protect, createGroupChat)
// router.route('/renamegroup').put(protect, renameGroupChat)
// router.route('/groupremoveuser').put(protect, removeUserGroupChat)
// router.route('/groupadduser').put(protect, addUserGroupChat)

// router.route('/deletechat').put(protect, deleteChat)
// router.route('/deletemessages').put(protect, deleteMessages)

module.exports = router
