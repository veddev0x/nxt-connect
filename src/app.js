//Web dependencies
const express = require('express');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 8080;
app.set('json spaces', 2);

app.use(helmet());

// Core dependencies
const core = require('./utils/core');

// Routers
const accountRouter = require('./routers/account');
const assetRouter = require('./routers/asset');
app.use(accountRouter);
app.use(assetRouter);

app.get('*', (req, res) => {
    res.status(404).json({
        error: {
            code: res.statusCode,
            message: 'Valid service parameter must be provided.',
        }
    })
});

app.listen(port, () => {
    console.info(`Server is listening at port ${port}`);
    core.initiate();
});