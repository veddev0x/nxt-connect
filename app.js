const peersAPI = require('./utils/peersAPI.js')
const request = require('request')
const chalk = require('chalk')
const dns = require('dns')

peersAPI.getPeers((error, peersData) => {
    if (error) {
        console.log(error)
    } else {
        console.log(peersData)

        try {
            peersData.forEach(peer => {
                if (peer.includes('linode.com') || peer.includes('wcgacc.com')) {
                    peersAPI.getGeoIP(peer, (error, { country, org, dnsResult, pingMS }) => {
                        console.log(peer + '(' + chalk.green.inverse.bold(dnsResult) + ')' + ' - ' + country + '(' + org + ')')
                    })
                }
            })
        } catch (e) {
            console.log(e)
        }

    }
})