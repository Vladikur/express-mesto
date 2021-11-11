const User = require('../models/user')

const getUsers = (req, res) => {
    return User.find({})
        .then((users) => {
            if (users) {
            return res
                .status(200)
                .send(users)
            } else {
            return res
                .status(404)
                .send({
                    message: "Запрашиваемый пользователь не найден"
                })
            }
            })
        .catch((error) => {
            return res
                .status(500)
                .send({
                    message: `Ошибка: ${error.message}`
                });
            })
}

const getUsersById = (req, res) => {
    const { userId } = req.params

    return User.findById(userId)
        .then((user) => {
            if (user) {
                return res
                    .status(200)
                    .send(user)
            } else {
            return res
                .status(404)
                .send({
                    message: "Запрашиваемый пользователь не найден"
                })
            }
            })
        
        .catch((error) => {
            return res
                .status(500)
                .send({
                    message: `Ошибка: ${error.message}`
                });
            })
}

const createUser = (req, res) => {
    return User.create({...req.body})
        .then((user) => { 
            if (user) {
            return res
                .status(201)
                .send(user)
            } else {
            return res
                .status(400)
                .send({
                    message: "Переданы некорректные данные для создания пользователя"
                })
            }
            })
        .catch((error) => {
            return res
                .status(500)
                .send({
                    message: `Ошибка: ${error.message}`
                });
            })
}

const patchUser = (req, res) => {
        const { name, about } = req.body
        return User.findByIdAndUpdate(req.user._id, { name, about })
        .then((user) => { 
            if (user) {
            return res
                .status(200)
                .send(user)
            } else if (!req.user._id) {
            return res
                .status(404)
                .send({
                    message: "Запрашиваемый пользователь не найден"
                })
            } else {
            return res
                .status(400)
                .send({
                    message: "Переданы некорректные данные для обновления данных пользователя"
                }) 
            }
            })
        .catch((error) => {
            return res
                .status(500)
                .send({
                    message: `Ошибка: ${error.message}`
                });
            })
}

const avatarUser = (req, res) => {
    const { avatar } = req.body
    return User.findByIdAndUpdate(req.user._id, { avatar })
        .then((user) => { 
            if (user) {
            return res
                .status(200)
                .send(user)
            } else {
            return res
                .status(400)
                .send({
                    message: "Переданы некорректные данные для обновления аватара пользователя"
                })
            }
            })
        .catch((error) => {
            return res
                .status(500)
                .send({
                    message: `Ошибка: ${error.message}`
                });
            })
}



module.exports = { 
    getUsers,
    getUsersById,
    createUser,
    patchUser,
    avatarUser
}