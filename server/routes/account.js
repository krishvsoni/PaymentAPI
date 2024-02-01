const express = require('express');
const { Account } = require('../db');
const { authMiddleware } = require('../middleware');
const mongoose = require('mongoose');
const router = express.Router();
const { z } = require('zod');

const transferSchema = z.object({
    to: z.string(),
    amount: z.number().gt(0)
})

router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });
        return res.json({
            balance: account.balance
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error with fetching account details."
        });
    }
});

router.post('/transfer', authMiddleware, async (req, res) => {

    const validateFields = transferSchema.safeParse(req.body);
    if(!validateFields.success){
        return res.status(400).json({
            message: "Invalid fields."
        });
    }

    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    const account = await Account.findOne({ userId: req.userId }).session(session);

    if(!account || account.balance < parseInt(amount)){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance."
        })
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if(!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid Account."
        });
    }

    await Account.updateOne({ userId: account.userId }, {
        $inc: { balance: -parseInt(amount) }
    }).session(session);

    await Account.updateOne({ userId: toAccount.userId }, {
        $inc: { balance: parseInt(amount) }
    }).session(session);

    await session.commitTransaction();
    res.json({
        message: "Tranfer successfull"
    })
})

module.exports = router;
