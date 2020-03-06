const { Sequelize, DataTypes } = require('sequelize')
const express = require('express');
const bodyParser = require('body-parser');
const argon2 = require('argon2');
const Joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({})
const session = require('express-session')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
})

const myLogger = function (req, res, next) {
    if (req.session.firstname) {
        next();
        return;
    }
    res.send('no one connected')
    return
};

const User = sequelize.define('User', {
    Firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

async function createUser(firstname, lastname, email, password) {
    if (firstname === null || email === null || lastname === null || password === null) {
        console.error("Merci de renseigner tout les champs: prenom, nom, email et mdp");
        return
    }
    return await User.create({ Firstname: firstname, Lastname: lastname, Email: email, Password: password });
}

async function getUsers(email) {
    const user = await User.findOne({ where: { Email: email } })
    return user
}
async function updateUser(user, modifications) {
    if (modifications.Firstname != null) user.Firstname = modifications.Firstname
    if (modifications.Lastname != null) user.Lastname = modifications.Lastname
    if (modifications.Email != null) user.Email = modifications.Email
    if (modifications.Password != null) user.Password = modifications.Password
    await user.save();
}

async function deleteUser(user) {
    await user.destroy();
}


async function startServer() {
    await sequelize.sync();
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(session({
        secret: 'JeremyLevilaindu94@epitech',
        resave: false,
        saveUninitialized: false,
        cookie: {secure: true}
    }));

    app.get('/users/:email', async (req, res) => {
        const { email } = req.params;
        try {
            if (!email) {
                res.send("Please enter an email");
                return
            }
            const user = await getUsers(email);
            if (!user)
                return res.sendStatus(400)
            res.send(user);
        } catch (e) {
            res.send(e);
        }
    })
    app.put('/users/:id', async (req, res) => {
        try {
            if (!req.body.email) return res.send("Please enter an Email");
            const user = await User.findOne({ where: { Email: req.body.email } })
            try {
                if (req.body.password) {
                    let hash = await argon2.hash(req.body.password)
                }
            } catch (e) {
                res.send(e)
            }
            await updateUser(user, {
                Firstname: req.body.firstname,
                Lastname: req.body.lastname,
                Email: req.body.email,
                Password: hash
            })
            res.send(user.dataValues);
        } catch (e) {
            res.send(e);
        }
    })

    app.delete('/users/:email', async (req, res) => {
        try {
            if (!req.params.email) return res.send("please enter a valide email")
            const user = await User.findOne({ where: { Email: req.params.email } })
            await deleteUser(user)
            res.send(user)
        } catch (e) {
            res.send(e);
        }
    })
    const queryRegister = Joi.object({
        lastname: Joi.string().required(),
        firstname: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    const queryLogin = Joi.object({
        password: Joi.string().required(),
        email: Joi.string().required()
    })
    app.post('/register', validator.body(queryRegister), async (req, res) => {
        try {
            await createUser(req.body.firstname, req.body.lastname, req.body.email, await argon2.hash(req.body.password));
            res.send(`Welcome ${req.body.firstname, req.body.lastname}`);
        } catch (e) {
            return res.sendStatus(401);
        }
    })
    app.post('/login', validator.body(queryLogin), async (req, res) => {
        try {
            const users = await getUsers(req.body.email)
            console.log(users.dataValues)
            if (!users) return res.status(400).send({ error: "No such user" });
            const connected = await argon2.verify(users.Password, req.body.password);
            if (!connected) return res.status(400).send({ error: "Password don't mzatch" });
            req.session.firstname = users.dataValues.Firstname;
            req.session.lastname = users.dataValues.Lastname;
            res.send(`Hello ${users.dataValues.Firstname} ${users.dataValues.Lastname}`);
        } catch (e) {
            console.error(e);
            return res.status(500).end();
        }
    })
    app.get('/me', myLogger ,async (req, res) => {
        res.send(`${req.session.firstname} ${req.session.lastname} is connected`);
    })
    app.get('/logout',myLogger , async (req, res) => {
        req.session.destroy();
        res.send('Good bye my lover');
    })
    app.listen(8080);
}

startServer();