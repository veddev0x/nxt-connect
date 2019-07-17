const endpoint = (platform) => {

    switch (platform) {
        case 'wcgacc.com':
        case 'wcg':
            return ({
                WCG_HOST: 'http://172.104.176.246/',
                WCG_ARGUMENT: 'wcg?requestType='
            })
        default:
            return platform + 'API endpoint is not found'
    }
}

module.exports = endpoint