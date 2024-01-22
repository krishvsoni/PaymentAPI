const express = require('express');
const { User } = require('../db');

const router = express.Router();

router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || '';
    const users = await User.find({
        $or: [
            { firstName: { $regex: filter } },
            { lastName: { $regex: filter } }
        ]
    });

    res.json({
        users: users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

module.exports = router;
