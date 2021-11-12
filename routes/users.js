const router = require('express').Router()
const { getUsers, getUsersById, createUser, patchUser, avatarUser } = require('../controllers/users')

router.get('/', getUsers)
router.get('/:userId', getUsersById)
router.post('/', createUser)
router.patch('/me', patchUser)
router.patch('/me/avatar', avatarUser)

module.exports = router