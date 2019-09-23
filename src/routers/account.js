'use strict';

const express = require('express');
const router = new express.Router();

const {getAccount} = require('../lib/account');

router.get('/api/account/:address', async (req, res) => {
    const WCG_ADDRESS = req.params.address;

    if (!WCG_ADDRESS) {
        return res.status(400).json({
            error: {
                code: res.statusCode,
                message: 'Please provide address parameter in the following format: WCG-1234-ABCD-5678-EFGH'
            }
        })
    }

    console.info(WCG_ADDRESS);

    try {
        const accountObject = await getAccount(WCG_ADDRESS);

        res.json(accountObject)
    } catch (e) {
        res.status(400).json({
            error: {
                code: res.statusCode,
                message: e.message
            }
        })
    }
});

module.exports = router;
