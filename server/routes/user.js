const express = require('express');
const { JWT_SECRET } = require('../config.js');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const router = express.Router();
const { User, Account } = require('../db.js');
const { authMiddleware } = require('../middleware.js');

const signupSchema = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})

const signinSchema = z.object({
    username: z.string().email(),
    password: z.string()
})

const updateSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().optional(),
})

router.post('/signup', async (req, res) => {
    const payload = req.body;
    const validateFields = signupSchema.safeParse(payload);
    if (!validateFields.success) {
        return res.status(401).json({
            message: "Incorrect inputs"
        })
    }

    const userExist = await User.findOne({ username: payload.username })
    if (userExist) {
        return res.status(401).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username: payload.username,
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: payload.password
    });

    const userId = user._id;

    await Account.create({
        userId: userId,
        balance: Math.floor(Math.random() * 10000) + 1
    })

    const token = jwt.sign({ userId }, JWT_SECRET);

    return res.status(200).json({
        message: "User created successfully",
        token
    })
});

router.post('/signin', async (req, res) => {
    const payload = req.body;
    const validate = signinSchema.safeParse(payload);
    if (!validate.success) {
        return res.status(401).json({
            message: "Incorrect details"
        })
    }

    const user = await User.findOne({ username: payload.username, password: payload.password });
    if (!user) {
        return res.status(401).json({
            message: "Incorrect credentials"
        });
    }

    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SECRET);
    return res.status(200).json({
        message: "logged in successfully",
        token
    })
})

router.put('/', authMiddleware, async (req, res) => {
    const validateFields = updateSchema.safeParse(req.body);
    if (!validateFields.success) {
        return res.status(401).json({
            message: "Update User Error: Invalid Fields"
        });
    }

    try {
        await User.findOneAndUpdate({ _id: req.userId }, req.body);
        res.status(200).json({
            message: "Updated successfully."
        });

    } catch (err) {
        res.status(411).json({
            message: "Error while updating User."
        });
    }
});

router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || '';
    try {
        const users = await User.find({
            $or: [
                {
                    firstName: { "$regex": filter }
                },
                {
                    lastName: { "$regex": filter }
                },
            ]
        });

        return res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });

    } catch (err) {
        return res.status(500).json({
            message: "Database Error: get all users : error while fetching all users"
        });
    }
});

module.exports = router;

