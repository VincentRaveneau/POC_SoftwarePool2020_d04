const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const trans = express();
const cookieParser = require('cookie-parser');
const argon2 = require('argon2');
const session = require('express-session');
const Joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({});
const User = require('./serveur.js');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './transactions.sqlite',
});

class Transactions extends Model { }
Transactions.init({
    Accountnumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Recieveraccountnumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    modelName: 'Transactions',
});

const querytransaction = Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    amount: Joi.integer().required()
})

const history_transaction = Joi.object({
    Firstname: Joi.string().required(),
})

async function transactions(from, to, amount) {
    const from_user = await User.findOne({ where: { from } });
    const to_user = await User.findOne({ where: { to } });
    from_user.Balance -= amount;
    to_user += amount;
    Transactions.Accountnumber = from;
    Transactions.Recieveraccountnumber = to;
    Transactions.Amount = amount;
    return [from_user, to_user];
}

async function list_user(firstname) {
    const user = await User.findAll({ where: { firstname } });
    console.log('User:', JSON.stringify(user, null, 4));
    return user;
}

trans.get('/history', validator.params(history_transaction), async (res, req) => {
    try {
        const user = await list_user(req.params.Firstname);
        res.send(user);
    } catch (e) {
        res.send(e);
        console.log(e);
    }
})

trans.post('/transaction', validator.body(querytransaction), async (req, res) => {
    if (from_user.Balance - amount < -100) res.send('no enough money in the balance');
    try {
        await transactions(req.body.from, req.body.to, req.body, req.body.amount);
        res.send('Transaction completed !').status(200);
    } catch (e) {
        res.send(e);
        console.log(e);
    }
})

module.exports = trans;