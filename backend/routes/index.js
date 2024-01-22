const express = require('express');
const userRouter = require('./user');
const bulkUserRouter = require('./bulkUser'); 

const router = express.Router();

router.use('/user', userRouter);
router.use('/bulkUser', bulkUserRouter);

module.exports = router;
