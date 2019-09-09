//Web dependencies
const express = require('express');
const helmet = require('helmet');

const chalk = require('chalk');

const app = express();
const port = process.env.PORT || 8080;
app.set('json spaces', 2);

app.use(helmet());

const account = require('./api/account');
const message = require('./api/message');

app.get('/api/account/:address', async (req, res) => {
    const WCG_ADDRESS = req.params.address;

    if (!WCG_ADDRESS) {
        return res.status(400).json({
            error: {
                code: res.statusCode,
                message: 'Please provide address parameter in the following format: WCG-1234-ABCD-5678-EFGH'
            }
        })
    }

    console.log(WCG_ADDRESS);

    try {
        const accountObject = await account.details(WCG_ADDRESS);

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

app.post('/api/assets/:asset', async (req, res) => {

    const quantityDenominator = 10000;
    const feeDenominator = 100000000;

    // Secret Header
    const secret = req.headers['x-secret-pass'];

    // Route Parameters
    const asset = req.params.asset;

    // Query Parameters
    const recipient = req.query.recipient;
    const public = req.query.public_key;
    const quantity = req.query.quantity * quantityDenominator;
    const fee = req.query.fee * feeDenominator || 0.02 * feeDenominator;

    try {
        await account.sendAsset({
            secret,
            recipient,
            public,
            asset,
            quantity,
            fee
        });

        res.json({
            payload: {
                recipient,
                public,
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

app.post('/api/payment', (req, res) => {
    const quantityDenominator = req.params.amountNQT * 1000000000;
    const feeDenominator = 100000000

});

app.get('*', (req, res) => {
    res.status(404).json({
        error: {
            code: res.statusCode,
            message: 'Valid service parameter must be provided.',
        }
    })
});

app.listen(port, () => {
    console.log(chalk.green.bold.inverse('Server is listening at port ' + port))
});