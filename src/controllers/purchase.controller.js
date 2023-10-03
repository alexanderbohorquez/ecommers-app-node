const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart');

const getAll = catchError(async(req, res) => {
    const userId = req.user.id
    const purchase = await Purchase.findAll({
        where: {userId}
    });
    return res.json(purchase);
});

const create = catchError(async (req, res) => {
    const userId = req.user.id;
    const carts = await Cart.findAll({
        where: { userId },
        attributes: ['userId', 'productId', 'quantity'],
        raw: true,
    });
    console.log(carts);
    const purchases = await Purchase.bulkCreate(carts);
    await Cart.destroy({ where: { userId } });
    return res.status(201).json(purchases);
});


module.exports = {
    getAll,
    create
}