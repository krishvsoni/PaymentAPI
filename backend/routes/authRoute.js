const express = require('express');
const zod = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../db');
const { JWT_SECRET } = require('../config');

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { success } = signupBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            message: 'Incorrect inputs',
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username,
    });

    if (existingUser) {
        return res.status(400).json({
            message: 'Email already taken',
        });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    const token = jwt.sign({
        userId: user._id,
    }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
        message: 'User created successfully',
        token: token,
    });
});

router.post('/signin', async (req, res) => {
    const { success } = signinBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            message: 'Incorrect inputs',
        });
    }

    const user = await User.findOne({
        username: req.body.username,
    });

    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({
            userId: user._id,
        }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token: token,
        });
        return;
    }

    res.status(401).json({
        message: 'Invalid credentials',
    });
});

module.exports = router;
