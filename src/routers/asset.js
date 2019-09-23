'use strict';

const express = require('express');
const router = new express.Router();

const {transferAsset} = require('../lib/asset');

router.post('/api/assets/:asset', async (req, res) => {
    // X-Secret-Pass Header
    const secret = req.headers['x-secret-pass'];

    // Route Parameters
    const asset = req.params.asset;

    // Query Parameters
    const recipient = req.query.recipient;
    const pubKey = req.query.public_key;
    const quantity = req.query.quantity;
    const fee = req.query.fee || 0.02;

    try {
        await transferAsset({
            secret,
            recipient,
            pubKey,
            asset,
            quantity,
            fee
        });

        res.json({
            payload: {
                recipient,
                pubKey,
                asset,
                quantity: req.query.quantity
            }
        })
    } catch (e) {
        res.status(400).json({
            error: {
                code: res.statusCode,
                message: e.message
            }
        })
    }
}).get('/api/assets/:asset', (req, res) => {
    res.status(405).json({
        error: {
            code: res.statusCode,
            message: `${req.method} method is invalid.`,
        }
    })
});

module.exports = router;