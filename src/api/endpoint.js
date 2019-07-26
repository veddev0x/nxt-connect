const endpoint = (platform) => {

    switch (platform) {
        case 'wcgacc.com':
        case 'wcg':
            return ({
                WCG_HOST: 'http://209.97.167.183/',
                WCG_ARGUMENT: 'wcg?requestType='
            })
        default:
            return platform + 'Invalid NXT platform.'
    }
}

module.exports = endpoint