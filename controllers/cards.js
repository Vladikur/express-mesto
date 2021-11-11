const Card = require('../models/card')

const getCard = (req, res) => {
    return Card.find({})
        .then((cards) => { 
            if (cards) {
            return res
                .status(200)
                .send(cards)
            } else {
            return res
                .status(400)
                .send({
                    message: "Переданы некорректные данные для отображения карточек"
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

const createCard = (req, res) => {
    const { owner } = req.user._id
    const { name, link } = req.body
    return Card.create({name, link, owner})
        .then((card) => { 
            if (card) {
            return res
                .status(201)
                .send(card)
            } else {
            return res
                .status(400)
                .send({
                    message: "Переданы некорректные данные для создания карточки"
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

const deleteCard = (req, res) => {
    return Card.findByIdAndRemove(req.params._id)
        .then((user) => {
            if (user) { 
            return res
                .status(200)
                .send(user)
            } else {
            return res
                .status(404)
                .send({
                    message: "Запрашиваемая карточка не найдена"
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

const putLike = (req, res) => {
    return Card.findByIdAndUpdate(req.params._id,
        { $addToSet: { likes: req.user._id } },
        { new: true },)
        .then((card) => { 
            if (card) {
            return res
                .status(201)
                .send(card)
            } else if (!req.user._id) {
            return res
                .status(404)
                .send({
                    message: "Передан несуществующий _id пользователя"
                })
            } else {
            return res
                .status(400)
                .send({
                    message: "Переданы некорректные данные для постановки лайка"
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

const deleteLike = (req, res) => {
    return Card.findByIdAndUpdate(req.params._id,
        { $pull: { likes: req.user._id } },
        { new: true },)
        .then((card) => { 
            if (card) {
            return res
                .status(200)
                .send(card)
            } else if (!req.user._id) {
            return res
                .status(404)
                .send({
                    message: "Передан несуществующий _id пользователя"
                })
            } else {
            return res
                .status(400)
                .send({
                    message: "Переданы некорректные данные для снятия лайка"
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
    getCard,
    createCard,
    deleteCard,
    putLike,
    deleteLike 
}