const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Product = sequelize.define('product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT, 
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT, 
        allowNull: false
    }
});


sequelize.sync();

module.exports = Product;
